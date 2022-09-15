import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private logging: LoggingService) { }

  clearLogs() {
    if (confirm("Are you sure you want to clear the logs?")) {
      this.logging.clearLog();
    }
  }
}
