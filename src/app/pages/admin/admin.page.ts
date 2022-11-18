import { AdminService } from '@/app/services/admin.service';
import { AlertService } from '@/app/services/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.css']
})
export class AdminPage implements OnInit {

  constructor(
    public alert: AlertService,
    public admin: AdminService
  ) { }

  ngOnInit(): void {
  }

}
