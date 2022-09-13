import * as text from '@/helpers/text';
import { Account } from '@/models';
import { AccountType } from '@/models/account';
import { AccountId, EtransferClient, TestEntity } from '@/models/entities';
import { Transaction, TransactionType } from '@/models/transaction';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { plainToClass } from 'class-transformer';


var testAccounts: Account[] = [
  {
    id: plainToClass(AccountId, { accountNum: 1 }),
    type: AccountType.CHEQUING,
    ownerUuid: 1,
    name: "Account 1",
    balance: 76.55,
    transactions: [{
      type: TransactionType.ETRANSFER,
      date: new Date(),
      sender: plainToClass(AccountId, { accountNum: 1 }),
      recipient: new EtransferClient("test", "test@mail.com"),
      amount: 123.45,
      balance: 76.55
    },
    {
      type: TransactionType.DEBIT,
      date: new Date(),
      sender: new TestEntity("Employer"),
      recipient: plainToClass(AccountId, { accountNum: 1 }),
      amount: 200.00,
      balance: 200.00,
    },]
  },
  {
    id: plainToClass(AccountId, { accountNum: 2 }),
    type: AccountType.SAVINGS,
    ownerUuid: 1,
    name: "Savings",
    balance: 67.89,
    transactions: [
      {
        type: TransactionType.ETRANSFER,
        date: new Date(),
        sender: new EtransferClient("test", "test@mail.com"),
        recipient: plainToClass(AccountId, { accountNum: 2 }),
        amount: 67.89,
        balance: 67.89,
      }
    ]
  }
]

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];

  txFilter: FormControl;
  txSearchForm: FormGroup;
  currentAccount: Account | null = null;
  filteredTransactions: Transaction[] = [];

  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {
    this.accounts = testAccounts;
    this.txFilter = new FormControl('');
    this.txSearchForm = new FormGroup([]);
  }
  ngOnInit(): void {
    this.txSearchForm = this.formBuilder.group({
      query: this.txFilter
    });
  }

  selectAccount(account: Account, modalContent: any) {
    this.currentAccount = account;
    this.txFilter.setValue('');
    this.filteredTransactions = this.currentAccount.transactions || []
    // this.recentTransactions = testTransactions.filter((tx) => tx.recipient?.equals(account.id) || tx.sender?.equals(account.id));
    // this.recentTransactions.sort((a, b) => a.date.getTime() - b.date.getTime())
    this.modalService.open(modalContent, { size: 'xl' }).result.then(() => {
      this.currentAccount = null;
      this.filteredTransactions = [];
    });
  }

  filterTx() {
    console.log("Searching " + this.txFilter.value);
    if (this.txFilter.value) {
      this.filteredTransactions = this.currentAccount?.transactions?.filter((x: Transaction) => x.description?.includes(this.txFilter.value) || x.sender?.safeString().includes(this.txFilter.value) || x.recipient?.safeString().includes(this.txFilter.value)) || []
    } else {
      this.filteredTransactions = this.currentAccount?.transactions || [];
    }
  }

  // Getter to expose library to templates.
  get textlib() { return text };
}
