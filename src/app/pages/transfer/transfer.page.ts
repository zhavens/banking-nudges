import { Component, OnInit } from '@angular/core';
import { SidebarType } from '@models/sidebar';

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
