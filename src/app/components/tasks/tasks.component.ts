import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertService, AuthenticationService, UserService } from '@app/services';
import { LoggingService } from '@app/services/logging.service';
import { TaskSelection, User } from '@models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @ViewChild('tasksModal') tasksModal: ElementRef = new ElementRef(null);

  user: User = new User();

  // tasksForm: FormGroup;
  taskSelection: TaskSelection;

  TASK_TYPES = [];

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public auth: AuthenticationService,
    private alert: AlertService,
    private userService: UserService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserTopic.subscribe((user: User) => {
      this.user = user;
    })
    this.taskSelection = new TaskSelection();
  }

  ngOnInit(): void {
  }

  openTasksModal(callback?: () => void) {
    this.logging.info(`Showing tasks modal.`);
    this.modalService.open(
      this.tasksModal, { size: 'l', centered: true, backdrop: 'static', keyboard: this.user.admin }).result.finally(() => {
        if (callback) callback();
        this.logging.info(`Closed tasks modal.`);
      });
  }

  submitTasks(): void {
    this.logging.info(`Submitted tasks`, [this.taskSelection]);
    this.user.personalization.tasksSelected = true;
    this.user.personalization.tasks = this.taskSelection;
    this.userService.updateUser(this.user);
    this.modalService.dismissAll();
  }
}
