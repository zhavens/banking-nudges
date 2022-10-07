import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TasksComponent } from '@/components/tasks/tasks.component';
import { User } from '@/models/user';
import { AuthenticationService, UserService } from '@/services';
import { PersonalizationService } from '@/services/personalization.service';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.page.html' })
export class HomePage implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChild(TasksComponent)
  private tasksModal!: TasksComponent;

  user: User = new User();
  loading: boolean = true;

  constructor(
    private auth: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private personalization: PersonalizationService
  ) {
    this.auth.currentUserTopic.subscribe((user: User) => {
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