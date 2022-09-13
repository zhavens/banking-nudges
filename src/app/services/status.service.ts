import { Status } from "@/models/status";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private statusUrl = '/api/status';
  private status: Status = new Status();

  constructor(private http: HttpClient) { }

  // Get the status
  getStatus(): Observable<Status> {

    return this.http.get<Status>(this.statusUrl);
  }

  showStatus() {
    this.getStatus()
      .subscribe((data: Status) => this.status = data);
  }

  // Error handling
  private error(error: any) {
    let message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }
}