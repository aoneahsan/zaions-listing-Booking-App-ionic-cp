import { Component } from '@angular/core';

import { Platform, NavController, LoadingController } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private _navCtl: NavController,
    private _authService: AuthService,
    private _loadingCtl: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onLogout() {
    this._authService.logout();
    this._loadingCtl.create({ keyboardClose: true, message: "Loading..." }).then(
      res => {
        res.present();
        setTimeout(() => {
          res.dismiss();
          this._navCtl.navigateForward('/auth');
        }, 2000);
      }
    );
  }
  
}
