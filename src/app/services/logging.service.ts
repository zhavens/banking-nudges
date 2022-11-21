
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Subject } from 'rxjs';
import { LogEntry } from '../../models/log';
import { AuthenticationService } from './auth.service';

const STORAGE_KEY = 'log';

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map((x: any) => plainToInstance(LogEntry, x)) || [];

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
export class LoggingSocket {
  private socket?: WebSocket;
  public status: Subject<number> = new Subject<number>();
  private initialized: boolean = false;

  constructor(private http: HttpClient) {
    if (!environment.static) {
      this.status.next(LoggingStatus.UNKNOWN);
      this.connect();
    } else {
      this.status.next(LoggingStatus.STATIC);
    }
  }

  private connect(): void {
    const protocol = environment.secure ? 'wss' : 'ws'
    this.socket = new WebSocket(`${protocol}://${window.location.host}/api/logging`);
    this.socket.onopen = (event) => {
      console.log('Logging socket connected.')
      this.initialized = true;
      this.status.next(LoggingStatus.CONNECTED);
    }
    this.socket.onerror = (event) => {
      console.error('Logging socket error:', event);
      // If error and connection is closed, attempt to reconnect.
      if (!this.initialized) {
        this.status.next(LoggingStatus.DISCONNECTED);
        console.error('Unable to initialize socket.')
      } else if (this.socket?.readyState != 1) {
        this.status.next(LoggingStatus.CONNECTING);
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

  send(data: string) {
    this.waitForSocketConnection(() => { this.socket?.send(data) });
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggingBaseService {
  constructor(private http: HttpClient, public socket: LoggingSocket) { }

  protected writeLog(entry: LogEntry) {
    console.log(entry.toShortString(), ...entry.objects);
    if (!environment.static) {
      this.socket.send(JSON.stringify(instanceToPlain(entry)));
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

@Injectable({
  providedIn: 'root'
})
export class LoggingService extends LoggingBaseService {
  constructor(http: HttpClient,
    socket: LoggingSocket,
    private auth: AuthenticationService) {
    super(http, socket);
  }

  protected override writeLog(entry: LogEntry) {
    if (this.auth.isLoggedIn && this.auth.currentUser) {
      entry.username = this.auth.currentUser.username;
    }
    super.writeLog(entry);
  }
}
