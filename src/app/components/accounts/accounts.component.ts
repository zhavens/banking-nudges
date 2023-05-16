import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { LoggingService } from '@/app/services/logging.service';
import { ModalService } from '@/app/services/modal.service';
import { PersonalizationService } from '@/app/services/personalization.service';
import * as text from '@/helpers/text';
import { Transaction } from '@/models/transaction';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService } from '@app/services/auth.service';
import { Account } from '@models/account';
import { User } from '@models/user';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {
  @ViewChild(TemplateRef) accountDetailsModal!: TemplateRef<any>;

  accounts?: Account[];
  currentAccount: Account | undefined = undefined;

  today: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,) {
    this.auth.currentUserObs.subscribe((user: User) => { this.accounts = this.auth.currentUser?.accounts });
  }

  ngAfterContentInit(): void {
    this.route.queryParamMap.subscribe(
      (params: ParamMap) => {
        let id = params.get('id');
        if (id) {
          console.log("Id", id)
          let account = this.accounts?.find(x => x.id.accountNum == parseInt(id!));
          if (account) {
            console.log(account);
            this.currentAccount = account;
          }
        }
      }
    )
  }

  showDetails(account: Account) {
    this.currentAccount = account;
  }

  // Getter to expose library to templates.
  get textlib() { return text };
}

@Component({
  selector: 'app-account-details',
  templateUrl: './details.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountDetailsComponent implements OnInit, OnChanges {
  @ViewChild(TemplateRef) detailsModal!: TemplateRef<any>;
  @Input() account: Account | undefined = undefined;
  @Output() accountChange = new EventEmitter<Account | undefined>();

  txFilter: FormControl;
  txSearchForm: FormGroup;
  filteredTransactions: Transaction[] = [];

  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private personalization: PersonalizationService,
    private logging: LoggingService) {

    this.txFilter = new FormControl('');
    this.txSearchForm = new FormGroup([]);
  }

  ngOnInit(): void {
    this.txSearchForm = this.formBuilder.group({
      query: this.txFilter
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['account'].firstChange) {
      this.showDetails();
    }
  }

  ngAfterViewInit(): void {
    if (this.account) {
      this.showDetails();
    }
  }

  showDetails() {
    if (this.account) {
      this.logging.info(`Showing account modal for ${this.account.name}`);
      this.txFilter.setValue('');
      this.account = this.account;
      this.filteredTransactions = this.account.transactions || []
      if (this.detailsModal) {
        this.modalService.baseService.open(this.detailsModal, {
          size: 'lg',
          fullscreen: 'md'
        }).result.finally(() => {
          this.logging.info(`Closed account modal for ${this.account?.name}.`);
          this.account = undefined;
          this.accountChange.emit(undefined);
          this.filteredTransactions = [];
        });
      }
    }
  }

  filterTx() {
    if (this.txFilter.value) {
      this.filteredTransactions = this.account?.transactions?.filter((x: Transaction) => x.description?.includes(this.txFilter.value) || x.sender?.safeString().includes(this.txFilter.value) || x.recipient?.safeString().includes(this.txFilter.value)) || []
    } else {
      this.filteredTransactions = this.account?.transactions || [];
    }

    this.logging.info(`Filtered using query <${this.txFilter.value}>, showing ${this.filteredTransactions.length} accounts.`)
  }

  showCurrentTransactions() {
    this.modalService.openConfirmation(
      'Show Transactions',
      `Are you sure you want to look at the details of ${this.personalization.personalString()}'s accounts? They will get a notificiation that you've elected to do so.`,
      'Show Transactions', 'Cancel').
      then(
        () => {
          if (this.account) {
            this.logging.info(`Showing transactions for account ${this.account.name}`)
            this.account.showTransactions = true;
          }
        }
      );
  }

  // Getter to expose library to templates.
  get textlib() { return text };
}
