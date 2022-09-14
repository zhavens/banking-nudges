import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@/services';
import { SidebarService, SidebarType } from '@/services/sidebar.service';

@Component({ selector: 'app-sidebar', templateUrl: 'sidebar.component.html' })
export class SidebarComponent implements OnInit {
  sidebarType: SidebarType = SidebarType.DEFAULT;
  sidebarCount: number = 2;

  constructor(private sidebarService: SidebarService,
    public auth: AuthenticationService) {
    this.sidebarType = sidebarService.type;
    this.sidebarCount = 2;
  }

  ngOnInit() { }
}