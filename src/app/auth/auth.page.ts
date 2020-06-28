import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private _navCtl: NavController, private _authService: AuthService) { }

  ngOnInit() {
  }

  onLogin() {
    this._authService.login();
  }

}
