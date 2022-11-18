import { AuthenticationService } from '@/app/services/auth.service';
import { LoggingService } from '@/app/services/logging.service';
import { ModalService } from '@/app/services/modal.service';
import { User } from '@/models/user';
import { Component, OnInit } from '@angular/core';
import { SidebarType } from '@models/sidebar';

@Component({
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.css']
})
export class TransferPage implements OnInit {
  SidebarType = SidebarType;
  pageConfirmed = false;

  user: User = new User();

  constructor(
    private auth: AuthenticationService,
    private modalService: ModalService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    if (this.auth.isLoggedIn && this.user.personalization.tasksSelected
      && !this.user.personalization.tasks.transfer
      && !this.user.personalization.tasks.moveBetween
      && !this.user.personalization.tasks.payBills) {
      this.modalService.openConfirmation(
        'Navigation Confirmation',
        'When you selected the tasks you were going to perform today, you did not select a relevant task for this page. Would you like to continue, or turn back?',
        'Continue',
        'Go Back')
        .then(() => {
          this.logging.info(`Page confirmed.`);
          this.pageConfirmed = true;
        })
        .catch(() => {
          this.logging.info(`Page declined.`);
          history.back()
        })
    } else {
      this.pageConfirmed = true;
    }
  }
}
