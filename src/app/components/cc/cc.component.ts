import { PersonalizationService } from '@/app/services/personalization.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ModalService } from '@/app/services/modal.service';
import * as text from '@/helpers/text';
import { AuthenticationService } from '@app/services/auth.service';
import { LoggingService } from '@app/services/logging.service';
import { CreditCard } from '@models/account';
import { Transaction } from '@models/transaction';
import { User } from '@models/user';

@Component({
  selector: 'app-cards',
  templateUrl: './cc.component.html',
  styleUrls: ['./cc.component.css']
})
export class CcComponent implements OnInit {
  cards?: CreditCard[];

  txFilter: FormControl;
  txSearchForm: FormGroup;
  currentCard: CreditCard | null = null;
  filteredTransactions: Transaction[] = [];

  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private auth: AuthenticationService,
    private personalization: PersonalizationService,
    private logging: LoggingService) {
    this.auth.currentUserObs.subscribe((user: User) => { this.cards = this.auth.currentUser?.cards });

    this.txFilter = new FormControl('');
    this.txSearchForm = new FormGroup([]);
  }
  ngOnInit(): void {
    this.txSearchForm = this.formBuilder.group({
      query: this.txFilter
    });
  }

  selectCard(card: CreditCard, modalContent: any) {
    this.logging.info(`Showing card modal for ${card.name}`);
    this.txFilter.setValue('');
    this.currentCard = card;
    this.filteredTransactions = this.currentCard.transactions || []
    this.modalService.baseService.open(modalContent, {
      size: 'lg',
      fullscreen: 'md'
    }).result.finally(() => {
      this.logging.info(`Closed card modal for ${card.name}.`);
      this.currentCard = null;
      this.filteredTransactions = [];
    });
  }

  filterTx() {
    if (this.txFilter.value) {
      this.filteredTransactions = this.currentCard?.transactions?.filter((x: Transaction) => x.description?.includes(this.txFilter.value) || x.sender?.safeString().includes(this.txFilter.value) || x.recipient?.safeString().includes(this.txFilter.value)) || []
    } else {
      this.filteredTransactions = this.currentCard?.transactions || [];
    }

    this.logging.info(`Filtered using query "${this.txFilter.value}", showing ${this.filteredTransactions.length} cards.`)
  }

  showCurrentTransactions() {
    this.modalService.openConfirmation(
      'Show Transactions',
      `Are you sure you want to look at the details of ${this.personalization.personalString()}'s accounts? They will get a notificiation that you've elected to do so.`,
      'Show Transactions', 'Cancel').
      then(
        () => {
          if (this.currentCard) {
            this.logging.info(`Showing transactions for card ${this.currentCard.name}`)
            this.currentCard.showTransactions = true;
          }
        }
      );
  }

  // Getter to expose library to templates.
  get textlib() { return text };
}
