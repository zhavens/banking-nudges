import { ModalService } from '@/app/services/modal.service';
import { PersonalizationService } from '@/app/services/personalization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from '@app/services';
import { LoggingService } from '@app/services/logging.service';
import { Account } from '@models/account';
import { Transaction } from '@models/transaction';
import { User } from '@models/user';
import * as text from '../../../helpers/text';

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
    private modalService: ModalService,
    private auth: AuthenticationService,
    private personalization: PersonalizationService,
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
    this.logging.info(`Showing account modal for ${account.name}`);
    this.txFilter.setValue('');
    this.currentAccount = account;
    this.filteredTransactions = this.currentAccount.transactions || []
    this.modalService.baseService.open(modalContent, {
      size: 'lg',
      fullscreen: 'md'
    }).result.finally(() => {
      this.logging.info(`Closed account modal for ${account.name}.`);
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

  showCurrentTransactions() {
    this.modalService.openConfirmation(
      'Show Transactions',
      `Are you sure you want to look at the details of ${this.personalization.oaString()}'s accounts? They will get a notifcation that you've elected to do so.`,
      'Show Transactions', 'Cancel').
      then(
        () => {
          if (this.currentAccount) {
            this.logging.info(`Showing transactions for account ${this.currentAccount.name}`)
            this.currentAccount.showTransactions = true;
          }
        }
      );
  }

  // Getter to expose library to templates.
  get textlib() { return text };
}
