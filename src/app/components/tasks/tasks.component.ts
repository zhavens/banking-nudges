import { PersonalizationService } from '@/app/services/personalization.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@app/services/auth.service';
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
    private logging: LoggingService,
    public personalization: PersonalizationService,
  ) {
    this.auth.currentUserObs.subscribe((user: User) => {
      this.user = user;
    })
    this.taskSelection = new TaskSelection();
  }

  ngOnInit(): void {
  }

  selectAll(): void {
    this.taskSelection.checkBalance = true;
    this.taskSelection.payBills = true;
    this.taskSelection.moveBetween = true;
    this.taskSelection.transfer = true;
    this.taskSelection.managePayments = true;
    this.taskSelection.manageServices = true;
    this.taskSelection.other = false;
    this.taskSelection.otherDetails = '';
  }

  openTasksModal(callback?: () => void): Promise<any> {
    this.logging.info(`Showing tasks modal.`);
    return this.modalService.open(
      this.tasksModal, { size: 'l', centered: true, backdrop: 'static', keyboard: this.user.admin }).result.finally(() => {
        if (callback) callback();
        this.logging.info(`Closed tasks modal.`);
      });
  }

  submitTasks(): void {
    this.logging.info(`Submitted tasks`, [this.taskSelection]);
    this.user.personalization.tasksSelected = true;
    this.user.personalization.tasks = this.taskSelection;
    this.auth.updateUser(this.user);
    this.modalService.dismissAll();
  }
}
