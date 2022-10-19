import * as text from '@/helpers/text';
import { CreditCard } from '@/models/account';
import { Transaction } from '@/models/transaction';
import { User } from '@/models/user';
import { AuthenticationService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
    private modalService: NgbModal,
    private auth: AuthenticationService,
    private logging: LoggingService) {
    this.auth.currentUserTopic.subscribe((user: User) => { this.cards = this.auth.currentUser?.cards });

    this.txFilter = new FormControl('');
    this.txSearchForm = new FormGroup([]);
  }
  ngOnInit(): void {
    this.txSearchForm = this.formBuilder.group({
      query: this.txFilter
    });
  }

  selectCard(card: CreditCard, modalContent: any) {
    this.logging.info(`Showing card modal for ${JSON.stringify(card.id)}`);
    this.txFilter.setValue('');
    this.currentCard = card;
    this.filteredTransactions = this.currentCard.transactions || []
    this.modalService.open(modalContent, {
      size: 'lg',
      fullscreen: 'md'
    }).result.finally(() => {
      this.logging.info(`Closed card modal.`);
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

  // Getter to expose library to templates.
  get textlib() { return text };
}
