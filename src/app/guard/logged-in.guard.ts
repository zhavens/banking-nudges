import { AuthenticationService } from '@/services';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isLoggedIn) {
      return true;
    } else {
      let urltree = this.router.parseUrl('/login');
      urltree.queryParams['returnUrl'] = route.url;
      return urltree;
    }
  }

}
