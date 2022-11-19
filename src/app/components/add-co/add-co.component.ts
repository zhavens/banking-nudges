import { AlertService } from '@/app/services/alert.service';
import { ModalService } from '@/app/services/modal.service';
import { PersonalizationService } from '@/app/services/personalization.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/services/auth.service';
import { LoggingService } from '@app/services/logging.service';
import { User } from '@models/user';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-co',
  templateUrl: './add-co.component.html',
  styleUrls: ['./add-co.component.css']
})
export class AddCoComponent implements OnInit {
  @ViewChild('addCoModal') addCoModal: ElementRef = new ElementRef(null);

  user: User = new User();
  openModal?: NgbModalRef;

  addingCo: boolean = false;
  cancelling: boolean = false;

  constructor(
    private modalService: ModalService,
    public auth: AuthenticationService,
    private alert: AlertService,
    private logging: LoggingService,
    public personalization: PersonalizationService,
  ) {
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  openAddCoModal(callback?: () => void): Promise<any> {
    this.logging.info(`Showing add close other modal.`);
    this.openModal = this.modalService.baseService.open(
      this.addCoModal, { size: 'l', centered: true, backdrop: 'static', keyboard: this.user.admin })
    return this.openModal.result
      .then(() => {
        this.logging.info('Add Close Other: Complete')
        this.alert.success(`Thank you for starting the process of adding another close other!`, true)
      })
      .catch((reason) => {
        this.logging.info(`Add Close Other dismissed: ${reason}`);
      })
      .finally(() => {
        if (callback) callback();
        this.addingCo = false;
        this.cancelling = false;
        this.openModal = undefined;
      });
  }
}
