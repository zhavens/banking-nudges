import { AuthenticationService } from '@/app/services';
import { ModalService } from '@/app/services/modal.service';
import { SidebarType } from '@/models/sidebar';
import { User } from '@/models/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.css']
})
export class AccountsPage implements OnInit {
  SidebarType = SidebarType;
  pageConfirmed = false;

  user: User = new User();

  constructor(
    private auth: AuthenticationService,
    private modalService: ModalService,
    private router: Router,
  ) {
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    if (this.auth.isLoggedIn && this.user.personalization.tasksSelected && !this.user.personalization.tasks.checkBalance) {
      this.modalService.openConfirmation(
        'Navigation Confirmation',
        'When you selected the tasks you were going to perform today, you did not select balance checking. Would you like to continue, or turn back?',
        'Continue',
        'Go Back')
        .catch(() => { history.back() })
        .finally(() => {
          this.pageConfirmed = true;
        })
    } else {
      this.pageConfirmed = true;
    }
  }
}
