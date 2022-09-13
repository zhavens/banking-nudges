import { Component, OnInit } from '@angular/core';

import { SidebarService, SidebarType } from '@/services/sidebar.service';

@Component({ selector: 'app-sidebar', templateUrl: 'sidebar.component.html' })
export class SidebarComponent implements OnInit {
  sidebarType: SidebarType = SidebarType.DEFAULT;

  constructor(private sidebarService: SidebarService) {
    this.sidebarType = sidebarService.type;
  }

  ngOnInit() { }
}