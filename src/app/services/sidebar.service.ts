import { SidebarType } from '@/models/sidebar';
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sidebarType: SidebarType = SidebarType.NONE;
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.sidebarType = SidebarType.NONE;
        }
      }
    });
  }

  get type(): SidebarType {
    return this.sidebarType;
  }
}