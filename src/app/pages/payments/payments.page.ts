import { AuthenticationService } from '@/app/services';
import { LoggingService } from '@/app/services/logging.service';
import { ModalService } from '@/app/services/modal.service';
import { User } from '@/models/user';
import { Component, OnInit } from '@angular/core';
import { SidebarType } from '@models/sidebar';

@Component({
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.css']
})
export class PaymentsPage implements OnInit {
  SidebarType = SidebarType;
  pageConfirmed = false;

  user: User = new User();

  constructor(
    private auth: AuthenticationService,
    private modalService: ModalService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    if (this.auth.isLoggedIn && this.user.personalization.tasksSelected && !this.user.personalization.tasks.payBills) {
      this.modalService.openConfirmation(
        'Navigation Confirmation',
        'When you selected the tasks you were going to perform today, you did not select bill payment. Would you like to continue, or turn back?',
        'Continue',
        'Go Back')
        .then(() => {
          this.logging.info(`Page confirmed.`);
          this.pageConfirmed = true;
        })
        .catch(() => {
          this.logging.info(`Page declined.`);
          history.back();
        })
    } else {
      this.pageConfirmed = true;
    }
  }
}
