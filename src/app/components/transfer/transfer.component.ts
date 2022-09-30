import { atLeastOne } from '@/helpers/validators';
import { Account, CreditCard } from '@/models/account';
import { AccountId, AchAccount, CreditCardId, EtransferClient } from '@/models/entities';
import { Transaction, TransactionType } from '@/models/transaction';
import { Payee, User } from '@/models/user';
import { AlertService, AuthenticationService, UserService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  @ViewChild('etransferClientModal') etransferClientModal: ElementRef = new ElementRef(null);

  user: User = new User();
  tx = new Transaction();

  transferForm: FormGroup;
  transferAmount: string = '';
  etransferForm: FormGroup;

  otherEtransfer = new EtransferClient("", "");

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public auth: AuthenticationService,
    private alert: AlertService,
    private userService: UserService,
    private logging: LoggingService,
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
      amount: [0.0, Validators.required],

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
        this.modalService.open(
          this.etransferClientModal, { size: 'xl' }).result.finally(() => {
            this.logging.info(`Closed e-transfer modal.`);
          });
      } else {
        this.submitTransfer()
      }
      this.transferForm.reset();
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
    this.submitTransfer();
    this.etransferForm.reset();
    this.modalService.dismissAll();
  }

  cancelTransfer() {
    this.tx = new Transaction();
    this.transferForm.reset();
    this.etransferForm.reset();
    this.modalService.dismissAll();
  }

  submitTransfer() {
    this.tx.date = new Date();

    switch (this.transferForm.value['recipient'].constructor) {
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
      this.logging.info(`Submitting transfer: ${JSON.stringify(this.tx)}`);
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
      this.userService.updateUser(this.user);
      this.alert.success('Transfer successful!');
      this.transferForm.reset();
      this.etransferForm.reset();
    }
  }

  twoNumberDecimal(event: Event): string {
    if (event && event.target && event.target instanceof HTMLInputElement) {
      return parseFloat((event.target as HTMLInputElement).value).toFixed(2);
    }
    return ''
  }
}
