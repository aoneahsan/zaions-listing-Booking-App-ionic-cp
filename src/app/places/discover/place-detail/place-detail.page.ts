import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlaceModel } from '../../place-model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: PlaceModel;

  constructor(
    private _route: ActivatedRoute,
    private _navCtl: NavController,
    private _placeService: PlacesService,
    private _modalCtl: ModalController,
    private _actionSheetCtl: ActionSheetController
  ) { }

  ngOnInit() {
    this._route.paramMap.subscribe(
      params => {
        if (!params.has('placeID')) {
          this._navCtl.navigateBack('/places/tabs/offers');
          return;
        }
        this.place = this._placeService.getPlace(params.get('placeID'));
      }
    );
  }

  onBook() {
    // this._router.navigateByUrl('/places/tabs/discover');
    // this._navCtl.navigateBack('/places/tabs/discover');
    // this._navCtl.pop();
    this._actionSheetCtl.create({
      header: 'Select Option',
      buttons: [
        {
          text: 'Select Date',
          handler: () => this.openBookingModal('select')
        },
        {
          text: 'Random Date',
          handler: () => this.openBookingModal('random')
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(
      obj => {
        obj.present();
      }
    );
  }

  openBookingModal(mode: 'select'|'random') {
    console.log(mode);
    this._modalCtl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place
      }
    }).then(
      modalObject => {
        modalObject.present();
        return modalObject.onDidDismiss();
      }
    ).then(
      modalResponse => {
        console.log(modalResponse);
        if (modalResponse.role === 'book') {
          console.log("BOOKED!!!!");
        }
      }
    );
  }

}
