import { Component, OnInit } from '@angular/core';
import { PlaceModel } from '../../place-model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  
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
