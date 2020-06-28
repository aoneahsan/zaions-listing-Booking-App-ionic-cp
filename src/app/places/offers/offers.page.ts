import { Component, OnInit } from '@angular/core';
import { PlaceModel } from '../place-model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  loadedPlaces: PlaceModel[];

  constructor(private _placeService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this._placeService.places;
  }

}
