import { Account } from '@/models/account';
import { AccountId, AchAccount, EtransferClient } from '@/models/entities';
import { Transaction, TransactionType } from '@/models/transaction';
import { User } from '@/models/user';
import { AlertService, AuthenticationService, UserService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  user?: User;

  transferForm: FormGroup;
  transferAmount: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public auth: AuthenticationService,
    private alert: AlertService,
    private userService: UserService,
    private logging: LoggingService,
  ) {
    this.user = auth.currentUser;
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })

    this.transferForm = this.formBuilder.group({
      sender: ['', Validators.required],
      recipient: ['', Validators.required],
      amount: [0.0, Validators.required],
    })
  }

  ngOnInit(): void { }

  submitTransfer() {
    if (!this.transferForm.valid) {
      this.alert.error("Please fill out missing fields before submitting.");
    } else if (!this.user) {
      this.alert.error("Unable to find current user!");
    } else {
      let tx = new Transaction();
      tx.date = new Date();
      tx.sender = this.transferForm.value['sender'];
      tx.recipient = this.transferForm.value['recipient'];
      tx.amount = this.transferForm.value['amount'];

      switch (this.transferForm.value['recipient'].constructor) {
        case EtransferClient:
          tx.type = TransactionType.ETRANSFER;
          break;
        case AchAccount:
          tx.type = TransactionType.ACH;
          break;
        default:
          tx.type = TransactionType.DEBIT;
      }

      let srcAccount = this.user?.accounts?.find((account: Account) => { return account.id.equals(tx.sender as AccountId) });
      if (!srcAccount) {
        this.alert.error(`Invalid source account: ${JSON.stringify(tx.sender)}`);
      } else if (srcAccount.balance < tx.amount) {
        this.alert.error(`Insufficient funds in source account.`);
      } else {
        srcAccount.balance = srcAccount.balance.minus(tx.amount);
        tx.balance = srcAccount.balance;
        srcAccount.transactions?.push(tx);
        this.logging.info(`Submitting transfer: ${JSON.stringify(tx)}`);
        if (tx.recipient instanceof AccountId) {
          let destAccount = this.user?.accounts?.find((account: Account) => { return account.id.equals(tx.recipient as AccountId) });
          if (destAccount) {
            destAccount.balance = destAccount.balance.plus(tx.amount);
            // Record the transaction for the destination account.
            let destTx = new Transaction();
            destTx.date = tx.date;
            destTx.sender = tx.sender;
            destTx.recipient = tx.recipient;
            destTx.amount = tx.amount;
            destTx.balance = destAccount.balance;
            destAccount.transactions.push(destTx);
          }
        }
        this.userService.updateUser(this.user);
        this.alert.success('Transfer successful!');
        this.transferForm.reset();
      }
    }

  }

  twoNumberDecimal(event: Event): string {
    if (event && event.target && event.target instanceof HTMLInputElement) {
      return parseFloat((event.target as HTMLInputElement).value).toFixed(2);
    }
    return ''
  }
}
