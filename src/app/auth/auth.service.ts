import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isUserAutheticated: boolean = true;
  // private _isUserAutheticated: boolean = false;

  private _userID: string = 'abcd';

  constructor(private _navCtl: NavController) { }

  get isUserLoggedIn() {
    return this._isUserAutheticated;
  }

  get UserID() {
    return this._userID;
  }

  login() {
    this._isUserAutheticated = true;
  }

  logout() {
    this._isUserAutheticated = false;
  }

}
