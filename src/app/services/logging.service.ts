import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Subject } from 'rxjs';
import { LogEntry } from '../../models/log';

const STORAGE_KEY = 'log';

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map((x: any) => plainToInstance(LogEntry, x)) || [];

export enum LoggingStatus {
  UNKNOWN,
  STATIC,
  CONNECTED,
  DISCONNECTED,
  CONNECTING,
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private socket?: WebSocket;
  public status: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) {
    if (!environment.static) {
      this.status.next(LoggingStatus.UNKNOWN);
      this.connect();
    } else {
      this.status.next(LoggingStatus.STATIC);
    }
  }

  private connect(): void {
    this.socket = new WebSocket(`ws://${window.location.host}/api/logging`);
    this.socket.onopen = (event) => {
      console.log('Logging socket connected.')
      this.status.next(LoggingStatus.CONNECTED);
    }
    this.socket.onerror = (event) => {
      console.log('Logging socket error:', event);
      this.status.next(LoggingStatus.CONNECTING);
      // If error and connection is closed, attempt to reconnect.
      if (this.socket?.readyState != 1) {
        this.connect();
      }
    }
    this.socket.onclose = (event) => {
      console.log('Logging socket closed.');
      this.status.next(LoggingStatus.DISCONNECTED);
    }
  }

  // Make the function wait until the connection is made...
  waitForSocketConnection(callback: any): void {
    setTimeout(
      () => {
        if (this.socket && this.socket.readyState === 1) {
          if (callback != null) {
            callback();
          }
        } else {
          this.waitForSocketConnection(callback);
        }
      }, 5); // wait 5 milisecond for the connection...
  }

  private writeLog(entry: LogEntry) {
    console.log(entry.toShortString(), ...entry.objects);
    if (!environment.static) {
      this.waitForSocketConnection(() => { this.socket?.send(JSON.stringify(instanceToPlain(entry))) });
    } else {
      logs.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }
  }

  clearLog(): void { }

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
