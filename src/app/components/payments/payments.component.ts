import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import * as uuid from "uuid";

import { ModalService } from '@/app/services/modal.service';
import { TEST_PAYEES } from '@/helpers/testdata';
import { conditionalValidator, futureDateValidator } from '@app/helpers/validators';
import { AlertService } from '@app/services/alert.service';
import { AuthenticationService } from '@app/services/auth.service';
import { LoggingService } from '@app/services/logging.service';
import { EtransferClient, isEntity } from '@models/entities';
import { Payment } from '@models/payment';
import { Payee, User } from '@models/user';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  @ViewChild('paymentModal') paymentModal: ElementRef = new ElementRef(null);

  user: User = new User();

  paymentAmount: string = '';
  unusualPayment: boolean = false;

  paymentForm: FormGroup;

  otherEtransfer = new EtransferClient("", "");

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    public auth: AuthenticationService,
    private alert: AlertService,
    private logging: LoggingService,
  ) {
    if (auth.currentUser) {
      this.user = auth.currentUser;
    }
    this.auth.currentUserObs.subscribe((user: User) => {
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
    }, {
      validators: [
        this.unusualPaymentValidator,
      ]
    })

  }

  ngOnInit(): void {
    // this.user = this.auth.currentUser;
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
  }

  unusualPaymentValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let recipient = control.get('to');
    let amount = control.get('amount');

    let unusualPayment = recipient && amount
      && recipient.touched && recipient.value && isEntity(recipient.value)
      && recipient.value.id.equals(TEST_PAYEES[0].id)
      && amount.value > 0.0 && amount.value != 46.45;

    if (unusualPayment && !this.unusualPayment) {
      this.logging.info(`Showing unusual payment value nudge.`);
    } else if (this.unusualPayment && !unusualPayment) {
      this.logging.info(`Hiding unusual payment value nudge.`);
    }
    this.unusualPayment = unusualPayment;

    return null;
  };

  removePayment(payment: Payment) {
    const payment_string = payment.description || payment.id
    this.logging.info(`Showing delete confirmation for payment`, [payment_string])
    this.modalService.openConfirmation('Remove Payment', 'Are you sure you want to delete this payment?').then((value) => {
      console.log(value);
      let idx = this.user.payments.findIndex((p: Payment) => { return p.id == payment.id });
      if (idx == -1) {
        this.logging.error(`Error finding payment`, [payment.id]);
        return;
      }
      this.logging.info(`Removing payment:`, [payment_string]);
      this.user.payments.splice(idx, 1);
      this.auth.updateUser(this.user);
    }).finally(() => { this.logging.info(`Delete confirmation for payment closed`, [payment_string]) });
  }

  showPaymentModal() {
    this.logging.info(`Showing payment modal.`);
    this.modalService.baseService.open(
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
    this.auth.updateUser(this.user).subscribe();
    this.modalService.dismissAll();
    this.paymentForm.reset();
    this.modalService.openNotification('Payment Added', "The payment was added successfully.");
  }

  twoNumberDecimal(event: Event): string {
    if (event && event.target && event.target instanceof HTMLInputElement) {
      return parseFloat((event.target as HTMLInputElement).value).toFixed(2);
    }
    return ''
  }
}
