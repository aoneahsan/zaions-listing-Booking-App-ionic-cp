import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaceModel } from '../place-model';
import { PlacesService } from '../places.service';
import { IonItemSliding, NavController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})

export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: PlaceModel[] = null;
  relevantPlaces: PlaceModel[] = null;
  private loadedPlacesSub: Subscription;
  private fetchPlacesSub: Subscription;

  selectedFilter: 'all' | 'bookable' = 'all';

  userID;

  constructor(
    private _placeService: PlacesService,
    private _nacCtl: NavController,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.loadedPlacesSub = this._placeService.getPlaces().subscribe(
      res => {
        this.loadedPlaces = res;
        this.relevantPlaces = res;
      }
    );
    this.userID = this._authService.UserID;
  }

  ionViewWillEnter() {
    if (!!!this.relevantPlaces) {
      this.fetchPlacesSub = this._placeService.fetchPlaces().subscribe(
        res => { },
        err => {
          alert("Error Occured while fetching places from server.");
        }
      );
    }
  }

  onEdit(item: PlaceModel, slidingItem: IonItemSliding) {
    slidingItem.close();
    this._nacCtl.navigateForward('/places/tabs/discover/' + item.id);
  }

  onDelete(item: PlaceModel, slidingItem: IonItemSliding) {
    slidingItem.close();
    alert("Delete");
  }

  onFilterChange(event: CustomEvent<SegmentChangeEventDetail>) {
    // console.log(event.detail);
    if (event.detail.value == 'all') {
      this.selectedFilter = 'all';
      this.relevantPlaces = this.loadedPlaces;
    } else if (event.detail.value == 'bookable') {
      this.selectedFilter = 'bookable';
      this.relevantPlaces = this.loadedPlaces.filter(el => el.userID != this.userID);
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
}
