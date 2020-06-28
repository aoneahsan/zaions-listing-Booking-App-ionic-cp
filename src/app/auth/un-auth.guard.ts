import { Injectable } from '@angular/core';
import { Route, UrlSegment, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import { NavController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private _authService: AuthService, private _navCtl: NavController) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._authService.isUserLoggedIn) {
      this._navCtl.navigateRoot('/places/tabs/discover');
      return;
    }
    else if (!this._authService.isUserLoggedIn) {
      return true;
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.canActivate(childRoute, state);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.isUserLoggedIn) {
      this._navCtl.navigateRoot('/places/tabs/discover');
      return;
    }
    else if (!this._authService.isUserLoggedIn) {
      return true;
    }
  }
}
