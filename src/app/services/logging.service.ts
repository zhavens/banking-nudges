import { LogEntry } from '@/models/log';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';

const STORAGE_KEY = 'log';

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map((x: any) => plainToInstance(LogEntry, x)) || [];

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  private writeLog(entry: LogEntry) {
    console.log(entry.toString());
    logs.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }

  clearLog() {
    localStorage.removeItem(STORAGE_KEY);
  }

  info(message: string) {
    this.writeLog(LogEntry.info(message));
  }

  warning(message: string) {
    this.writeLog(LogEntry.warning(message));

  }

  error(message: string) {
    this.writeLog(LogEntry.error(message));
  }

  fatal(message: string) {
    this.writeLog(LogEntry.fatal(message));
  }

  verbose(message: string) {
    this.writeLog(LogEntry.verbose(message));
  }
}
