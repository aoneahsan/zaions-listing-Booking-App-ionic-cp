import { Component, OnInit } from '@angular/core';
import { PlaceModel } from '../place-model';
import { PlacesService } from '../places.service';
import { IonItemSliding, NavController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  loadedPlaces: PlaceModel[];

  constructor(private _placeService: PlacesService, private _nacCtl: NavController) { }

  ngOnInit() {
    this.loadedPlaces = this._placeService.places;
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
    console.log(event.detail);
  }

}
