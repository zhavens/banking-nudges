import { AuthenticationService } from '@/app/services';
import { LoggingService } from '@/app/services/logging.service';
import { ModalService } from '@/app/services/modal.service';
import { SidebarType } from '@/models/sidebar';
import { User } from '@/models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.css']
})
export class ServicesPage implements OnInit {
  pageConfirmed = false;

  SidebarType = SidebarType;

  user: User = new User();
  loading: boolean = true;

  constructor(
    private auth: AuthenticationService,
    private modalService: ModalService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
  }

  ngOnInit() { }

  ngAfterContentInit(): void {
    if (this.auth.isLoggedIn && this.user.personalization.tasksSelected && !this.user.personalization.tasks.manageServices) {
      this.modalService.openConfirmation(
        'Navigation Confirmation',
        'When you selected the tasks you were going to perform today, you did not select service management. Would you like to continue, or turn back?',
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
