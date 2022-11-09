import { AuthenticationService } from '@/app/services';
import { ModalService } from '@/app/services/modal.service';
import { User } from '@/models/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
  ) {
    this.auth.currentUserTopic.subscribe((user: User) => {
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
        'When you selected the tasks you were going to perform today, you did not select a relevant task for this page. Would you like to continue, or turn back?')
        .catch(() => { history.back() })
        .finally(() => {
          this.pageConfirmed = true;
        })
    } else {
      this.pageConfirmed = true;
    }
  }
}
