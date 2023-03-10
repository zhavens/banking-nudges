import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { LoggingService } from '@/app/services/logging.service';
import { ModalService } from '@/app/services/modal.service';
import { PersonalizationService } from '@/app/services/personalization.service';
import * as text from '@/helpers/text';
import { Transaction } from '@/models/transaction';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthenticationService } from '@app/services/auth.service';
import { CreditCard } from '@models/account';
import { User } from '@models/user';

@Component({
    selector: 'app-cards',
    templateUrl: './cc.component.html',
    styleUrls: ['./cc.component.css']
})
export class CardsComponent {
    @ViewChild(TemplateRef) cardDetailsModal!: TemplateRef<any>;

    cards?: CreditCard[];
    currentCard: CreditCard | undefined = undefined;

    today: Date = new Date();

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private auth: AuthenticationService,) {
        this.auth.currentUserObs.subscribe((user: User) => { this.cards = this.auth.currentUser?.cards });
    }

    ngAfterContentInit(): void {
        this.route.queryParamMap.subscribe(
            (params: ParamMap) => {
                let num = params.get('num');
                if (num) {
                    let card = this.cards?.find(x => x.id.ccNum == parseInt(num!));
                    if (card) {
                        console.log(card);
                        this.currentCard = card;
                    }
                }
            }
        )
    }

    showDetails(card: CreditCard) {
        this.currentCard = card;
    }

    // Getter to expose library to templates.
    get textlib() { return text };
}

@Component({
    selector: 'app-card-details',
    templateUrl: './details.component.html',
    styleUrls: ['./cc.component.css']
})
export class CardDetailsComponent implements OnInit, OnChanges {
    @ViewChild(TemplateRef) detailsModal!: TemplateRef<any>;
    @Input() card: CreditCard | undefined = undefined;
    @Output() cardChange = new EventEmitter<CreditCard | undefined>();

    txFilter: FormControl;
    txSearchForm: FormGroup;
    filteredTransactions: Transaction[] = [];

    today: Date = new Date();

    constructor(
        private router: Router,
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
        if (!changes['card'].firstChange) {
            this.showDetails();
        }
    }

    ngAfterViewInit(): void {
        if (this.card) {
            this.showDetails();
        }
    }

    showDetails() {
        if (this.card) {
            this.logging.info(`Showing card modal for ${this.card.name}`);
            this.txFilter.setValue('');
            this.card = this.card;
            this.filteredTransactions = this.card.transactions || []
            if (this.detailsModal) {
                this.modalService.baseService.open(this.detailsModal, {
                    size: 'lg',
                    fullscreen: 'md'
                }).result.finally(() => {
                    this.logging.info(`Closed card modal for ${this.card?.name}.`);
                    this.card = undefined;
                    this.cardChange.emit(undefined);
                    this.filteredTransactions = [];
                });
            }
        }
    }

    filterTx() {
        if (this.txFilter.value) {
            this.filteredTransactions = this.card?.transactions?.filter((x: Transaction) => x.description?.includes(this.txFilter.value) || x.sender?.safeString().includes(this.txFilter.value) || x.recipient?.safeString().includes(this.txFilter.value)) || []
        } else {
            this.filteredTransactions = this.card?.transactions || [];
        }

        this.logging.info(`Filtered using query "${this.txFilter.value}", showing ${this.filteredTransactions.length} cards.`)
    }

    showCurrentTransactions() {
        this.modalService.openConfirmation(
            'Show Transactions',
            `Are you sure you want to look at the details of ${this.personalization.personalString()}'s card? They will get a notificiation that you've elected to do so.`,
            'Show Transactions', 'Cancel').
            then(
                () => {
                    if (this.card) {
                        this.logging.info(`Showing transactions for card ${this.card.name}`)
                        this.card.showTransactions = true;
                    }
                }
            );
    }

    // Getter to expose library to templates.
    get textlib() { return text };
}
