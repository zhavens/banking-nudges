import { atLeastOne } from '@/helpers/validators';
import { AccountId, AchAccount, Entity, EtransferClient, OtherEntity } from '@/models/entities';
import { Payee, User } from '@/models/user';
import { AuthenticationService, UserService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { plainToInstance } from 'class-transformer';

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
    private modalService: NgbModal,
    public auth: AuthenticationService,
    private userService: UserService,
    private logging: LoggingService,
  ) {
    this.user = auth.currentUser;
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
    this.accountPayeeForm = this.formBuilder.group({
      accountNum: [0, Validators.required],
    })
    this.achPayeeForm = this.formBuilder.group({
      institutionNum: [0, Validators.required],
      routingNum: [0, Validators.required],
      accountNum: [0, Validators.required],
    })
    this.etransferPayeeForm = this.formBuilder.group({
      email: [''],
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
      let payee = new Payee();
      payee.id = plainToInstance(type, <T>form.value);
      if (this.nickname) payee.nickname = this.nickname;
      this.logging.info(`Adding payee: ${JSON.stringify(payee)}`)

      this.user.payees.push(payee);
      this.userService.updateUser(this.user);
      console.log(this.user);
      this.modalService.dismissAll();
      form.reset();
    }
  }

  showPayeeModal(modalContent: any) {
    this.logging.info(`Showing add payee modal.`);
    this.modalService.open(modalContent, { size: 'xl' }).result.finally(() => {
      this.logging.info(`Closed add payee modal.`);
    });
  }

  removePayee(payee: Payee) {
    if (this.user && this.user.payees) {
      let idx = this.user.payees.findIndex((p: Payee) => p == payee);
      if (idx > -1) {
        this.user?.payees?.splice(idx, 1);
        this.userService.updateUser(this.user);
      }
    }
  }
}
