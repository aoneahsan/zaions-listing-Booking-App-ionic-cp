import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place-model';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  place: PlaceModel;

  constructor(
    private _route: ActivatedRoute,
    private _navCtl: NavController,
    private _placeService: PlacesService
  ) { }

  ngOnInit() {
    this._route.paramMap.subscribe(
      params => {
        if (!params.has('offerID')) {
          this._navCtl.navigateBack('/places/tabs/offers');
          return;
        }
        this.place = this._placeService.getPlace(params.get('offerID'));
      }
    );
  }

  ionViewWillEnter() {
  }

  onEditOffer() {
    this._navCtl.navigateForward(['/places/tabs/offers/edit/' + this.place.id]);
  }

}
