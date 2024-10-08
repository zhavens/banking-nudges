import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { plainToInstance } from 'class-transformer';

import { ModalService } from '@/app/services/modal.service';
import { atLeastOne } from '@app/helpers/validators';
import { AuthenticationService } from '@app/services/auth.service';
import { LoggingService } from '@app/services/logging.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { AccountId, AchAccount, Entity, EtransferClient, OtherEntity } from '@models/entities';
import { Payee, User } from '@models/user';

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrls: ['./payees.component.css']
})
export class PayeesComponent implements OnInit {

  user?: User;

  nickname: string = '';
  accountPayeeForm: FormGroup;
  achPayeeForm: FormGroup;
  etransferPayeeForm: FormGroup;
  otherPayeeForm: FormGroup;



  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    public auth: AuthenticationService,
    public personalization: PersonalizationService,
    private logging: LoggingService,
  ) {
    this.user = auth.currentUser;
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
    this.accountPayeeForm = this.formBuilder.group({
      accountNum: [0, [Validators.required, Validators.min(1)]],
    })
    this.achPayeeForm = this.formBuilder.group({
      institutionNum: [0, [Validators.required, Validators.min(1)]],
      routingNum: [0, [Validators.required, Validators.min(1)]],
      accountNum: [0, [Validators.required, Validators.min(1)]],
    })
    this.etransferPayeeForm = this.formBuilder.group({
      email: ['', Validators.email],
      phoneNum: [''],
    }, {
      validators: [atLeastOne(Validators.required, ['email', 'phoneNum'])]
    })
    this.otherPayeeForm = this.formBuilder.group({
      description: ['', Validators.required],
    })
  }

  ngOnInit(): void { }

  addAccountPayee() {
    this.addPayee<AccountId>(AccountId, this.accountPayeeForm);
  }

  addAchPayee() {
    this.addPayee<AchAccount>(AchAccount, this.achPayeeForm);
  }

  addEtransferPayee() {
    this.addPayee<EtransferClient>(EtransferClient, this.etransferPayeeForm);
  }

  addOtherPayee() {
    this.addPayee<OtherEntity>(OtherEntity, this.otherPayeeForm);
  }

  private addPayee<T extends Entity>(type: new () => T, form: FormGroup) {
    if (this.user && form.valid) {
      let payee = new Payee(plainToInstance(type, <T>form.value), this.nickname);
      this.logging.info(`Adding payee: `, [payee])

      this.user.payees.push(payee);
      this.auth.updateUser(this.user).subscribe();
      this.modalService.dismissAll();
      form.reset();
      this.nickname = '';
    }
  }

  showPayeeModal(modalContent: any) {
    this.logging.info(`Showing add payee modal.`);
    this.modalService.baseService.open(modalContent, { size: 'xl' }).result.finally(() => {
      this.logging.info(`Closed add payee modal.`);
    });
  }

  removePayee(payee: Payee) {
    this.logging.info(`Showing delete confirmation for payee`, [payee.id])
    this.modalService.openConfirmation('Delete Payee', 'Are you sure you want to delete this payee?').then(() => {
      if (this.user) {
        let idx = this.user.payees.findIndex((p: Payee) => p == payee);
        if (idx == -1) {
          this.logging.error(`Error finding payee`, [payee.id]);
          return;
        }
        this.logging.error(`Removing payee`, [payee.id]);
        this.user.payees?.splice(idx, 1);
        this.auth.updateUser(this.user);
      }
    }).finally(() => { this.logging.info(`Delete confirmation for payee closed`, [payee.id]) });
  }
}
