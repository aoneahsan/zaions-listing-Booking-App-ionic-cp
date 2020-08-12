import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private _authService: AuthService, private _navCtl: NavController) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._authService.autoLogin().pipe(
      take(1),
      map(
        user => {
          const isAuth = !!user;
          if (isAuth) {
            return true;
          } else {
            this._navCtl.navigateRoot(['/auth']);
            return false;
          }
        }
      )
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._authService.autoLogin().pipe(
      take(1),
      map(
        user => {
          const isAuth = !!user;
          if (isAuth) {
            return true;
          } else {
            this._navCtl.navigateRoot(['/auth']);
            return false;
          }
        }
      )
    );
  }

}
