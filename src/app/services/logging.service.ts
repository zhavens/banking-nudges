import { LogEntry } from '../../models/log';
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
    console.log(entry.toShortString(), ...entry.objects);
    // logs.push(entry);
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }

  clearLog() {
    localStorage.removeItem(STORAGE_KEY);
  }

  info(message: string, objects: Object[] = []) {
    this.writeLog(LogEntry.info(message, objects));
  }

  warning(message: string, objects: Object[] = []) {
    this.writeLog(LogEntry.warning(message, objects));

  }

  error(message: string, objects: Object[] = []) {
    this.writeLog(LogEntry.error(message, objects));
  }

  fatal(message: string, objects: Object[] = []) {
    this.writeLog(LogEntry.fatal(message, objects));
  }

  verbose(message: string, objects: Object[] = []) {
    this.writeLog(LogEntry.verbose(message, objects));
  }
}
