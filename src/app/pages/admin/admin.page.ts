import { AddCoComponent } from '@/app/components/add-co/add-co.component';
import { TasksComponent } from '@/app/components/tasks/tasks.component';
import { AdminService } from '@/app/services/admin.service';
import { AlertService } from '@/app/services/alert.service';
import { ModalService } from '@/app/services/modal.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  template: `
    <div class="row">
        <p>This is a <a>complex</a> confirmation. <i class="bi bi-check2-all"></i></p>
    </div>
  `
})
class ConfirmationContent {

}

@Component({
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.css']
})
export class AdminPage implements OnInit {
  @ViewChild(TasksComponent)
  public tasksModal!: TasksComponent;
  @ViewChild(AddCoComponent)
  public addCoModal!: AddCoComponent;

  constructor(
    public alert: AlertService,
    public admin: AdminService,
    public modal: ModalService,
  ) { }

  ngOnInit(): void {
  }
}
