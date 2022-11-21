import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoggingService, LoggingStatus } from '@/app/services/logging.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '@app/services/admin.service';
import { AuthenticationService } from '@app/services/auth.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { PersonalizationLevel, User } from '@models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public PersonalizationLevel = PersonalizationLevel;
  public levels: string[] = Object.values(PersonalizationLevel).filter((v) => typeof v === 'string' && isNaN(Number(v))) as string[];
  public LoggingStatus = LoggingStatus;

  user: User = new User();
  loggingStatus: number = 0;
  loggingStatusClass: string = '';

  personalizationForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public auth: AuthenticationService,
    public admin: AdminService,
    private personalization: PersonalizationService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserObs.subscribe(x => this.user = x);
    this.personalizationForm = this.formBuilder.group({
      level: [PersonalizationLevel[this.user.personalization.level]],
    })
    this.logging.socket.status.subscribe((val: number) => {
      this.loggingStatus = val;
      if (val == LoggingStatus.CONNECTED) {
        this.loggingStatusClass = 'text-success';
      } else if (val == LoggingStatus.DISCONNECTED) {
        this.loggingStatusClass = 'text-warning';
      } else if (val == LoggingStatus.CONNECTING) {
        this.loggingStatusClass = 'text-danger';
      }
    });
  }

  updatePersonalizationLevel(level: string) {
    this.user.personalization.level = (<any>PersonalizationLevel)[level];
    this.auth.updateUser(this.user).subscribe();
  }

  logout() {
    this.personalization.doLogoutUpdate();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
