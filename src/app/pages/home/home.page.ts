import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { TasksComponent } from '@app/components/tasks/tasks.component';
import { AuthenticationService } from '@app/services/auth.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { SidebarType } from '@models/sidebar';
import { User } from '@models/user';

@Component({
  styleUrls: ['home.page.css'],
  templateUrl: 'home.page.html'
})
export class HomePage implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild(TasksComponent)
  private tasksModal!: TasksComponent;

  SidebarType = SidebarType;

  user: User = new User();
  loading: boolean = true;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private personalization: PersonalizationService
  ) {
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    if (this.auth.isLoggedIn && this.user.personalization.showTasksModal) {
      this.tasksModal.openTasksModal(() => {
        this.loading = false;
        this.personalization.setShownTaskModal();
      })
    }
  }

  ngAfterContentInit(): void {
    if (this.auth.isLoggedIn && !this.user.personalization.showTasksModal) {
      this.loading = false;
    }
  }
}