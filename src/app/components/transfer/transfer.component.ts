import { ModalService } from '@/app/services/modal.service';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { atLeastOne } from '@app/helpers/validators';
import { AlertService } from '@app/services/alert.service';
import { AuthenticationService } from '@app/services/auth.service';
import { LoggingService } from '@app/services/logging.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { Account, AccountType, CreditCard } from '@models/account';
import { AccountId, AchAccount, CreditCardId, EtransferClient, isEntity } from '@models/entities';
import { Transaction, TransactionType } from '@models/transaction';
import { Payee, User } from '@models/user';
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, of } from 'rxjs';
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
  AccountType = AccountType;

  @ViewChild('etransferClientModal') etransferClientModal: ElementRef = new ElementRef(null);
  @ViewChild('transferSuccessModal') transferSuccessModal: ElementRef = new ElementRef(null);
  @ViewChild('confirmDetails') confirmDetails!: TemplateRef<any>;
  @ViewChild('successDetails') successDetails!: TemplateRef<any>;

  successModal?: NgbModalRef;

  user: User = new User();
  tx = new Transaction();
  currentDate = new Date();

  transferForm: FormGroup;
  transferAmount: string = '';
  etransferForm: FormGroup;

  otherEtransfer = new EtransferClient("", "");

  unusualPayment: boolean = false;
  largePayment: boolean = false;
  suggestReceipt: boolean = false;
  receiptHover: boolean = false;
  receiptUploaded: boolean = false;
  amountInputColor: string = '#ffffff';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    public auth: AuthenticationService,
    public personaliztion: PersonalizationService,
    private alert: AlertService,
    private logging: LoggingService,
    public personalization: PersonalizationService,
  ) {
    if (auth.currentUser) {
      this.user = auth.currentUser;
    }
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })

    this.transferForm = this.formBuilder.group({
      sender: ['', Validators.required],
      recipient: ['', Validators.required, this.ccPaymentValidator],
      amount: [0.0, [Validators.required, Validators.min(0.01)]],
    }, {
      validators: [
        srcDestValidator,
        this.unusualPaymentValidator,
        this.largePaymentValidator,
        this.suggestReceiptValidator,
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

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      let num = params.get('toCC');
      if (parseInt(num || '')) {
        let card = this.user.cards.find(c => c.id.ccNum === parseInt(num || ''))
        if (card) {
          this.transferForm.get('recipient')?.setValue(card.id);
        }
      }
    }
    );

    if (this.modalService.baseService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  ccPaymentValidator: ValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
    let recipient = control.value;

    if (recipient instanceof CreditCardId && !control.parent?.get('value')?.touched) {
      const cc = this.user.cards.find((val) => val.id.equals(recipient));
      if (cc) {
        this.logging.info(`Setting full balance amount for card ${recipient.safeString()}`);
        control.parent?.get('amount')?.setValue(cc.balance);
      }
    }

    return of(null);
  }

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

  suggestReceiptValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let recipient = control.get('recipient');

    const suggestReceipt = recipient && recipient.value && isEntity(recipient.value) && recipient.value.equals(TEST_PAYEES[1].id);
    if (suggestReceipt && !this.suggestReceipt) {
      this.logging.info(`Showing missing receipt nudge.`);
    } else if (this.suggestReceipt && !suggestReceipt) {
      this.logging.info(`Hiding missing receipt nudge.`);
    }
    this.suggestReceipt = suggestReceipt;

    return null;
  }

  console = console;
  receiptDragover(event: DragEvent): void {
    event.preventDefault();
    this.receiptHover = true;
    event.dataTransfer!.effectAllowed = "copy";
  }
  receiptDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer != null && event.dataTransfer.files.length > 0) {
      this.receiptUploaded = true;
    }
    this.receiptHover = false;
  }
  receiptLeave(event: DragEvent): void {
    event.preventDefault();
    this.receiptHover = false;
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
          this.etransferClientModal, { size: 'xl' }).result
          .catch(() => this.etransferForm.reset())
          .finally(() => this.logging.info(`Closed e-transfer modal.`));
      } else {
        this.modalService.openConfirmation('Confirm Transaction', this.confirmDetails)
          .then((result) => {
            this.submitTransfer();
            this.transferForm.reset();
            this.etransferForm.reset();
            return result;
          }, () => this.logging.warning("Transaction cancelled."));
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
      let payee = new Payee(client, nickname);
      this.user.payees.push(payee);
      this.logging.info(`Adding payee from etransfer: `, [payee])
    }
    this.modalService.openConfirmation('Confirm E-Transfer', this.confirmDetails).then(() => {
      this.submitTransfer();
      this.transferForm.reset();
      this.etransferForm.reset();
    }, () => this.logging.warning("E-transfer cancelled."));
  }

  cancelEtransfer() {
    this.tx = new Transaction();
    this.transferForm.reset();
    this.etransferForm.reset();
    this.modalService.dismissAll();
  }

  submitTransfer() {
    this.tx.date = new Date();
    this.tx.id = Math.floor(Math.random() * 999999).toString().padStart(6, '0');

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
      this.auth.updateUser(this.user);
      this.alert.success('Transfer successful!');
      this.transferForm.reset();
      this.etransferForm.reset();
      this.modalService.dismissAll();
      this.modalService.openNotification('Transfer Successful', this.successDetails);
    }
  }

  twoNumberDecimal(event: Event): string {
    if (event && event.target && event.target instanceof HTMLInputElement && event.target.value) {
      return parseFloat((event.target as HTMLInputElement).value).toFixed(2);
    }
    return ''
  }
}
