import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { conditionalValidator, futureDateValidator } from '@app/helpers/validators';
import { AlertService, AuthenticationService, UserService } from '@app/services';
import { LoggingService } from '@app/services/logging.service';
import { EtransferClient } from '@models/entities';
import { Payment } from '@models/payment';
import { Payee, User } from '@models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from "uuid";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @ViewChild('paymentModal') paymentModal: ElementRef = new ElementRef(null);

  user: User = new User();

  paymentAmount: string = '';

  paymentForm: FormGroup;

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
    this.paymentForm = formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      amount: [0.0, Validators.required],
      date: [0, [futureDateValidator(), Validators.required]],
      onetime: [true],
      permanent: [false],
      frequency: [''],
      duration: [{ value: 0 }, conditionalValidator({ 'permanent': false, 'onetime': false }, [Validators.required, Validators.min(1)])],
    })

  }

  ngOnInit(): void {
    // this.user = this.auth.currentUser;
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
  }

  removePayment(payment: Payment) {
    let idx = this.user.payments.findIndex((p: Payment) => { return p.id == payment.id });
    if (idx == -1) {
      this.logging.error(`Error removing payment with ID: ${payment.id}`);
      return;
    }
    this.logging.info(`Removing payment:`, [payment]);
    this.user.payments.splice(idx, 1);
    this.userService.updateUser(this.user);
  }

  showPaymentModal() {
    this.logging.info(`Showing payment modal.`);
    this.modalService.open(
      this.paymentModal, { size: 'l' }).result.finally(() => {
        this.logging.info(`Closed payment modal.`);
      });
  }

  submitPaymentForm() {
    let payment = new Payment();
    payment.id = uuid.v4();
    payment.amount = this.paymentForm.value['amount'];
    payment.from = this.paymentForm.value['from'];

    if (this.paymentForm.value['to'] instanceof Payee) {
      payment.to = this.paymentForm.value['to'].id;
    } else {
      payment.to = this.paymentForm.value['to'];
    }

    if (this.paymentForm.value['onetime']) {
      payment.frequency = `One time on ${this.paymentForm.value['date']}`
    } else {
      payment.frequency = `Every ${this.paymentForm.value['frequency']} starting on ${this.paymentForm.value['date']}`
      if (!this.paymentForm.value['permanent']) {
        payment.frequency += ` - ends after ${this.paymentForm.value['duration']} payments`
      }
    }
    this.logging.info(`Added new payment: ${JSON.stringify(payment)}`)
    this.user?.payments.push(payment);
    this.userService.updateUser(this.user);
    this.modalService.dismissAll();
    this.paymentForm.reset();
  }

  twoNumberDecimal(event: Event): string {
    if (event && event.target && event.target instanceof HTMLInputElement) {
      return parseFloat((event.target as HTMLInputElement).value).toFixed(2);
    }
    return ''
  }
}
