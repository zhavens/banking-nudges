import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false;

  constructor(private router: Router,
    private logging: LoggingService) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert message
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.logging.info(`Alert: ${message}`);
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(error: Error | string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    let message = error instanceof Error ? error.message : error;
    this.logging.error(`Alert: ${message}`);
    this.subject.next({ type: 'error', text: message });
  }

  clear() {
    // this.logging.info(`Clearing alert.`);
    this.subject.next("");
  }
}