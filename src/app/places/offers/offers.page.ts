import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaceModel } from '../place-model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';
import { IonItemSliding, NavController } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  loadedPlaces: PlaceModel[];
  private loadedPlacesSub: Subscription;
  private fetchPlacesSub: Subscription;

  constructor(
    private _placeService: PlacesService,
    private _navCtl: NavController
  ) { }

  ngOnInit() {
    this.loadedPlacesSub = this._placeService.getPlaces().subscribe(
      res => {
        this.loadedPlaces = res;
      }
    );
  }

  ionViewWillEnter() {
    if (!!!this.loadedPlaces) {
      this.fetchPlacesSub = this._placeService.fetchPlaces().subscribe();
    }
  }

  ngOnDestroy() {
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
    if (this.fetchPlacesSub) {
      this.fetchPlacesSub.unsubscribe();
    }
  }

  onEdit(item: PlaceModel, slidingItem: IonItemSliding) {
    slidingItem.close();
    this._navCtl.navigateForward('/places/tabs/offers/' + item.id);
  }
}
