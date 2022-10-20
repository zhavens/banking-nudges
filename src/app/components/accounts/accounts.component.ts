import * as text from '@/helpers/text';
import { AuthenticationService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Account } from '@models/account';
import { Transaction } from '@models/transaction';
import { User } from '@models/user';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts?: Account[];

  txFilter: FormControl;
  txSearchForm: FormGroup;
  currentAccount: Account | null = null;
  filteredTransactions: Transaction[] = [];

  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private auth: AuthenticationService,
    private logging: LoggingService) {
    this.auth.currentUserTopic.subscribe((user: User) => { this.accounts = this.auth.currentUser?.accounts });

    this.txFilter = new FormControl('');
    this.txSearchForm = new FormGroup([]);
  }
  ngOnInit(): void {
    this.txSearchForm = this.formBuilder.group({
      query: this.txFilter
    });
  }

  selectAccount(account: Account, modalContent: any) {
    this.logging.info(`Showing account modal for ${JSON.stringify(account.id)}`);
    this.txFilter.setValue('');
    this.currentAccount = account;
    this.filteredTransactions = this.currentAccount.transactions || []
    this.modalService.open(modalContent, {
      size: 'lg',
      fullscreen: 'md'
    }).result.finally(() => {
      this.logging.info(`Closed account modal.`);
      this.currentAccount = null;
      this.filteredTransactions = [];
    });
  }

  filterTx() {
    if (this.txFilter.value) {
      this.filteredTransactions = this.currentAccount?.transactions?.filter((x: Transaction) => x.description?.includes(this.txFilter.value) || x.sender?.safeString().includes(this.txFilter.value) || x.recipient?.safeString().includes(this.txFilter.value)) || []
    } else {
      this.filteredTransactions = this.currentAccount?.transactions || [];
    }

    this.logging.info(`Filtered using query "${this.txFilter.value}", showing ${this.filteredTransactions.length} accounts.`)
  }

  // Getter to expose library to templates.
  get textlib() { return text };
}
