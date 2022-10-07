import { SidebarType } from '@/models/sidebar';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.css']
})
export class TransferPage implements OnInit {

  SidebarType = SidebarType;

  constructor() { }

  ngOnInit(): void {
  }

}
