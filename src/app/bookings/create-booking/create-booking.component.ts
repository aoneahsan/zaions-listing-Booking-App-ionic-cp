import { BookingModal } from './../booking.modal';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PlaceModel } from 'src/app/places/place-model';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: PlaceModel;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('form') formObj: NgForm;

  startDate: string;
  endDate: string;

  userID;

  constructor(
    private _modalCtl: ModalController,
    private _authService: AuthService,
    private _alertCtl: AlertController,
    private _navCtl: NavController
  ) { }

  ngOnInit() {
    if (this.selectedMode == 'random') {
      this.startDate = new Date(
        this.selectedPlace.available_from.getTime() + Math.random() * (this.selectedPlace.available_to.getTime() - 10 * 24 * 60 * 60 * 1000 - this.selectedPlace.available_from.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() + (Math.random() * (new Date(this.startDate).getTime() + 8 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()))
      ).toISOString();
    }
    this.userID = this._authService.UserID;
  }

  ionViewWillEnter() {
    if (this.userID == this.selectedPlace.userID) {
      let alertEle = this._alertCtl.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: "user can't book his/her own place.",
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
            handler: () => {
              this._modalCtl.dismiss();
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
        this._navCtl.navigateBack(['/places/tabs/discover']);
      });
    }
  }

  onCancel() {
    this._modalCtl.dismiss(null, 'cancel');
  }

  onPlaceBooking(form: NgForm) {
    if (!form.valid || !this.datesValid) {
      return;
    } else {
      // console.log("Form Data = ", form.value);
      let newBooking = new BookingModal(
        Math.random().toString(),
        this.selectedPlace.id,
        this.userID,
        this.selectedPlace.name,
        this.selectedPlace.image,
        form.value['firstname'],
        form.value['lastname'],
        form.value['no_of_guest'],
        new Date(form.value['date_from']),
        new Date(form.value['date_to'])
      )
      this._modalCtl.dismiss(newBooking, 'book');
    }
  }

  datesValid() {
    if (!!this.formObj) {
      const startDate = new Date(this.formObj.value['date_from']);
      const endDate = new Date(this.formObj.value['date_to']);
      return endDate > startDate;
    }
  }
}
