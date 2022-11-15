import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from '@app/services';

import { LoggingService } from '@/app/services/logging.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '@app/services/admin.service';
import { PersonalizationService } from '@app/services/personalization.service';
import { PersonalizationLevel, User } from '@models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User = new User();

  public PersonalizationLevel = PersonalizationLevel;
  public levels: string[] = Object.values(PersonalizationLevel).filter((v) => typeof v === 'string' && isNaN(Number(v))) as string[];
  personalizationForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public auth: AuthenticationService,
    public admin: AdminService,
    private userService: UserService,
    private personalization: PersonalizationService,
    private logging: LoggingService,
  ) {
    this.auth.currentUserTopic.subscribe(x => this.user = x);
    this.personalizationForm = this.formBuilder.group({
      level: [PersonalizationLevel[this.user.personalization.level]],
    })
  }

  updatePersonalizationLevel(level: string) {
    this.user.personalization.level = (<any>PersonalizationLevel)[level];
    this.userService.updateUser(this.user).subscribe();
  }

  logout() {
    this.personalization.doLogoutUpdate();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
