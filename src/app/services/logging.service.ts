import { environment } from '@/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LogEntry } from '../../models/log';

const STORAGE_KEY = 'log';

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map((x: any) => plainToInstance(LogEntry, x)) || [];

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor(private http: HttpClient) { }

  private writeLog(entry: LogEntry) {
    console.log(entry.toShortString(), ...entry.objects);
    if (!environment.static) {
      this.http.post('api/logging',
        JSON.stringify(instanceToPlain(entry)),
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
        .subscribe({
          error: console.error
        });
    } else {
      logs.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }
  }

  clearLog() { }

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
