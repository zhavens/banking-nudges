import { Component, OnInit } from '@angular/core';
import { SidebarType } from '@models/sidebar';

@Component({
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.css']
})
export class PaymentsPage implements OnInit {
  SidebarType = SidebarType;

  constructor() { }

  ngOnInit(): void {
  }

}
