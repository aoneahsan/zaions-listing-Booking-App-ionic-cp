import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

  place: PlaceModel = null;
  placeID: string;

  private loadedPlacesSub: Subscription;
  private fetchPlacesSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _navCtl: NavController,
    private _placesService: PlacesService,
    private _alertCtl: AlertController
  ) { }

  ngOnInit() {
    this._route.paramMap.subscribe(
      params => {
        if (!params.has('offerID')) {
          this._navCtl.navigateBack('/places/tabs/offers');
          return;
        }
        this.placeID = params.get('offerID');
      }
    );
  }

  ionViewWillEnter() {
    this.loadedPlacesSub = this._placesService.getPlaces().subscribe(
      res => {
        if (!!!res) {
          this.fetchPlacesSub = this._placesService.fetchPlaces().subscribe();
        }
        else {
          let data = this._placesService.getPlace(this.placeID);
          if (!!!data.id) {
            this._alertCtl.create({
              header: "Not Found",
              message: "No Offer found.",
              buttons: [
                {
                  text: "Okay",
                  role: 'cancel',
                  handler: () => {
                    this._navCtl.navigateRoot(['/places/tabs/offers']);
                  }
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          }
          else {
            this.place = data;
          }
        }
      });
  }

  onEditOffer() {
    this._navCtl.navigateForward(['/places/tabs/offers/edit/' + this.place.id]);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
    if (this.fetchPlacesSub) {
      this.fetchPlacesSub.unsubscribe();
    }

  }
}
