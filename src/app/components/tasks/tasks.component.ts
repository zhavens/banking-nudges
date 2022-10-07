import { User } from '@/models/user';
import { AlertService, AuthenticationService, UserService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @ViewChild('tasksModal') tasksModal: ElementRef = new ElementRef(null);

  user: User = new User();

  tasksForm: FormGroup;

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
    this.tasksForm = this.formBuilder.group({
      payBills: [false],
      moveBetween: [false],
      transfer: [false],
      managePayments: [false],
      manageMortgage: [false],
      other: [false],
      otherDetails: [''],
    });
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
    this.logging.info(`Submitted tasks: ${JSON.stringify(this.tasksForm.value)}`)
    this.modalService.dismissAll();
  }
}
