import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService, AuthResponse } from './auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  isLogin: boolean = true;

  authSub: Subscription;

  constructor(
    private _navCtl: NavController,
    private _authService: AuthService,
    private _loadingCtl: LoadingController,
    private _alertCtl: AlertController
  ) { }

  ngOnInit() {
  }

  onSubmit(data) {
    console.log("Auth Data = ", data);
    let authObservable: Observable<AuthResponse>;
    this._loadingCtl.create({ keyboardClose: true, message: "Loading..." }).then(
      loadingEl => {
        loadingEl.present();
        if (this.isLogin) {
          authObservable = this._authService.signin(data.email, data.password);
        } else {
          authObservable = this._authService.signup(data.email, data.password);
        }
        this.authSub = authObservable.subscribe(
          res => {
            console.log("AuthPage == res = ", res);
            loadingEl.dismiss();
            this._navCtl.navigateForward('/places/tabs/discover');
          },
          err => {
            console.log("AuthPage == err = ", err);
            loadingEl.dismiss();
            const errorCode = err.error.error.message;
            let message = "Something went wrong, try again.";
            if (errorCode == "EMAIL_EXISTS") {
              message = "Email already exists";
            }
            else if (errorCode == "EMAIL_NOT_FOUND") {
              message = "No account found with this email.";
            }
            else if (errorCode == "INVALID_PASSWORD") {
              message = "Invalid data entered try again.";
            }
            this.showError(message);
          }
        );
      });
  }

  showError(message: string) {
    this._alertCtl.create({
      header: "Eroor Occured",
      message,
      buttons: ['Okay']
    }).then(alEl => {
      alEl.present();
    })
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
