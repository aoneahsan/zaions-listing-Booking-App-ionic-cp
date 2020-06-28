import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAutheticated: boolean = true;

  constructor(private _navCtl: NavController) { }

  get isUserLoggedIn() {
    return this._isUserAutheticated;
  }

  login() {
    this._isUserAutheticated = true;
    this._navCtl.navigateForward('/places/tabs/discover');
  }

  logout() {
    this._isUserAutheticated = false;
    this._navCtl.navigateForward('/auth');
  }

}
