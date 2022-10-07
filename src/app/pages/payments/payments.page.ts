import { SidebarType } from '@/models/sidebar';
import { Component, OnInit } from '@angular/core';

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
