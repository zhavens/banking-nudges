import { ModalService } from '@/app/services/modal.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { atLeastOne } from '@app/helpers/validators';
import { AlertService, AuthenticationService, UserService } from '@app/services';
import { LoggingService } from '@app/services/logging.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { Account, CreditCard } from '@models/account';
import { AccountId, AchAccount, CreditCardId, EtransferClient, isEntity } from '@models/entities';
import { Transaction, TransactionType } from '@models/transaction';
import { Payee, User } from '@models/user';
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TEST_PAYEES } from '../../../helpers/testdata';


const srcDestValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const sender = control.get('sender');
  const recipient = control.get('recipient');

  return sender && recipient && sender.value && sender.value == recipient.value ? { srcDest: true } : null;
};

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  @ViewChild('etransferClientModal') etransferClientModal: ElementRef = new ElementRef(null);
  @ViewChild('transferSuccessModal') transferSuccessModal: ElementRef = new ElementRef(null);
  successModal?: NgbModalRef;

  user: User = new User();
  tx = new Transaction();

  transferForm: FormGroup;
  transferAmount: string = '';
  etransferForm: FormGroup;

  otherEtransfer = new EtransferClient("", "");

  unusualPayment: boolean = false;
  largePayment: boolean = false;
  missingReceipt: boolean = false;
  receiptUploaded: boolean = false;
  amountInputColor: string = '#ffffff';

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    public auth: AuthenticationService,
    public personaliztion: PersonalizationService,
    private alert: AlertService,
    private logging: LoggingService,
    private userService: UserService,
    public personalization: PersonalizationService,
  ) {
    if (auth.currentUser) {
      this.user = auth.currentUser;
    }
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })

    this.transferForm = this.formBuilder.group({
      sender: ['', Validators.required],
      recipient: ['', Validators.required],
      amount: [0.0, [Validators.required, Validators.min(0.01)]],
    }, {
      validators: [
        srcDestValidator,
        this.unusualPaymentValidator,
        this.largePaymentValidator,
        this.missingReceiptValidator,
      ]
    })

    this.etransferForm = this.formBuilder.group({
      email: [''],
      phoneNum: [''],
      // amount: [0.0, Validators.required],
      savePayee: [false],
      nickname: ['']
    }, {
      validators: [atLeastOne(Validators.required, ['email', 'phoneNum'])]
    })
  }

  ngOnInit(): void { }


  unusualPaymentValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let recipient = control.get('recipient');
    let amount = control.get('amount');

    let unusualPayment = recipient && amount
      && recipient.touched && recipient.value && isEntity(recipient.value)
      && recipient.value.equals(TEST_PAYEES[0].id)
      && amount.value > 0.0 && amount.value != 46.45;

    if (unusualPayment && !this.unusualPayment) {
      this.logging.info(`Showing unusual payment value nudge.`);
    } else if (this.unusualPayment && !unusualPayment) {
      this.logging.info(`Hiding unusual payment value nudge.`);
    }
    this.unusualPayment = unusualPayment;

    return null;
  };

  largePaymentValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let amount = control.get('amount');

    this.amountInputColor = this.personalization.getGradientColor(amount?.value / 200.0)

    let largePayment = amount && amount.value && amount.value > 200.0;
    if (largePayment && !this.largePayment) {
      this.logging.info(`Showing large payment value nudge.`);
    } else if (this.largePayment && !largePayment) {
      this.logging.info(`Hiding large payment value nudge.`);
    }
    this.largePayment = largePayment;

    return null;
  };

  missingReceiptValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let recipient = control.get('recipient');

    const missingReceipt = recipient && recipient.value && isEntity(recipient.value) && recipient.value.equals(TEST_PAYEES[1].id);
    if (missingReceipt && !this.missingReceipt) {
      this.logging.info(`Showing missing receipt nudge.`);
    } else if (this.missingReceipt && !missingReceipt) {
      this.logging.info(`Hiding missing receipt nudge.`);
    }
    this.missingReceipt = missingReceipt;

    return null;
  }

  submitTransferForm() {
    if (!this.transferForm.valid) {
      this.alert.error("Please fill out missing fields before submitting.");
    } else if (!this.user) {
      this.alert.error("Unable to find current user!");
    } else {
      this.tx.sender = this.transferForm.value['sender'];
      this.tx.recipient = this.transferForm.value['recipient'];
      this.tx.amount = this.transferForm.value['amount'];

      if (this.transferForm.value['recipient'] == this.otherEtransfer) {
        this.logging.info(`Showing e-transfer modal.`);
        this.modalService.baseService.open(
          this.etransferClientModal, { size: 'xl' }).result.finally(() => {
            this.logging.info(`Closed e-transfer modal.`);
          });
      } else {
        this.confirmTransfer().then(() => {
          this.submitTransfer();
          this.transferForm.reset();
          this.etransferForm.reset();
        });
      }
    }
  }

  submitEtransferForm() {
    if (!this.etransferForm.valid) {
      this.alert.error("Please fill missing fields before submitting.");
      return;
    }

    let email = this.etransferForm.value['email']
    let phoneNum = this.etransferForm.value['phoneNum']
    let nickname = this.etransferForm.value['nickname']
    let client = new EtransferClient(nickname, email, phoneNum);
    this.tx.recipient = client;

    if (this.etransferForm.value['savePayee']) {
      this.user.payees.push(new Payee(client, nickname));
    }
    this.confirmTransfer().then(() => {
      this.submitTransfer();
      this.transferForm.reset();
      this.etransferForm.reset();
    }).finally(() => {
      this.modalService.dismissAll();
    });
  }

  confirmTransfer(): Promise<any> {
    return this.modalService.openConfirmation('Confirm Transaction', 'Are you sure you want to confirm this transaction?')
  }

  cancelTransfer() {
    this.tx = new Transaction();
    this.transferForm.reset();
    this.etransferForm.reset();
    this.modalService.dismissAll();
  }

  submitTransfer() {
    this.tx.date = new Date();

    switch (this.tx.recipient?.constructor) {
      case EtransferClient:
        this.tx.type = TransactionType.ETRANSFER;
        break;
      case AchAccount:
        this.tx.type = TransactionType.ACH;
        break;
      default:
        this.tx.type = TransactionType.DEBIT;
    }

    let srcAccount = this.user?.accounts?.find((account: Account) => { return account.id.equals(this.tx.sender as AccountId) });
    if (!srcAccount) {
      this.alert.error(`Invalid source account: ${JSON.stringify(this.tx.sender)}`);
    } else if (srcAccount.balance < this.tx.amount) {
      this.alert.error(`Insufficient funds in source account.`);
    } else {
      srcAccount.balance = srcAccount.balance.minus(this.tx.amount);
      this.tx.balance = srcAccount.balance;
      srcAccount.transactions?.push(this.tx);
      this.logging.info(`Submitting transfer`, [this.tx]);
      if (this.tx.recipient instanceof AccountId) {
        let destAccount = this.user?.accounts?.find((account: Account) => { return account.id.equals(this.tx.recipient as AccountId) });
        if (destAccount) {
          destAccount.balance = destAccount.balance.plus(this.tx.amount);
          // Record the transaction for the destination account.
          let destTx = new Transaction();
          destTx.date = this.tx.date;
          destTx.sender = this.tx.sender;
          destTx.recipient = this.tx.recipient;
          destTx.amount = this.tx.amount;
          destTx.balance = destAccount.balance;
          destAccount.transactions.push(destTx);
        }
      }
      if (this.tx.recipient instanceof CreditCardId) {
        let destCard = this.user?.cards?.find((card: CreditCard) => { return card.id.equals(this.tx.recipient as CreditCardId) });
        if (destCard) {
          destCard.balance = destCard.balance.minus(this.tx.amount);
          // Record the transaction for the destination account.
          let destTx = new Transaction();
          destTx.date = this.tx.date;
          destTx.sender = this.tx.sender;
          destTx.amount = this.tx.amount;
          destTx.balance = destCard.balance;
          destTx.description = `Transfer from ${this.tx.sender?.safeString()}`
          destCard.transactions.push(destTx);
        }
      }
      this.user.personalization.txCount += 1;
      this.userService.updateUser(this.user);
      this.alert.success('Transfer successful!');
      this.transferForm.reset();
      this.etransferForm.reset();
      this.modalService.openNotification('Transfer Successful', 'The transfer has been completed successfully!');
    }
  }

  twoNumberDecimal(event: Event): string {
    if (event && event.target && event.target instanceof HTMLInputElement && event.target.value) {
      return parseFloat((event.target as HTMLInputElement).value).toFixed(2);
    }
    return ''
  }
}
