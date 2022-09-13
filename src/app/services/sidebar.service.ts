import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

export enum SidebarType {
  DEFAULT
}

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sidebarType: SidebarType = SidebarType.DEFAULT;
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.sidebarType = SidebarType.DEFAULT;
        }
      }
    });
  }

  get type(): SidebarType {
    return this.sidebarType;
  }
}