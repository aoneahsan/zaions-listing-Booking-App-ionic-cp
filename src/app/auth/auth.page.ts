import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin: boolean = true;

  constructor(
    private _navCtl: NavController,
    private _authService: AuthService,
    private _loadingCtl: LoadingController
  ) { }

  ngOnInit() {
  }

  onSubmit(data) {
    console.log("Auth Data = ", data);
    this._authService.login();
    this._loadingCtl.create({ keyboardClose: true, message: "Loading..." }).then(
      res => {
        res.present();
        setTimeout(() => {
          res.dismiss();
          this._navCtl.navigateForward('/places/tabs/discover');
        }, 2000);
      }
    );
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

}
