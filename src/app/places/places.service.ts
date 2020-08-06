import { PlaceLocation } from './location.modal';
// Core Imports 
import { Injectable } from '@angular/core';

// Models & Interfaces
import { PlaceModel } from './place-model';
import { BehaviorSubject } from 'rxjs';
import { tap, take, delay, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceServerModal {// server response data format
  id: string,
  name: string,
  description: string,
  image: string,
  price: number,
  available_from: string,
  available_to: string,
  userID: string,
  location: PlaceLocation
}

@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  private _places: BehaviorSubject<PlaceModel[]> = new BehaviorSubject<PlaceModel[]>(null);

  constructor(private _http: HttpClient) { }

  fetchPlaces() {
    return this._http.get<{ [key: string]: PlaceServerModal }>(
      "https://ionic-course-project-a4b04.firebaseio.com/offered-places.json"
    ).pipe(
      map(res => {
        let places = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            let newPlace: PlaceModel = new PlaceModel(
              key,
              res[key].name,
              res[key].description,
              res[key].image,
              res[key].price,
              new Date(res[key].available_from),
              new Date(res[key].available_to),
              res[key].userID,
              res[key].location
            );
            places.push(newPlace);
          }
        }
        return places;
        // return [];
      }),
      tap(places => {
        this.setPlaces(places);
      })
    );
  }

  getPlaces() {
    return this._places;
  }

  setPlaces(data: PlaceModel[]) {
    this._places.next(data);
  }

  getPlace(id: string) {
    let placesData = this._places.value;
    return {
      ...placesData.find(p => p.id === id)
    };
  }

  addPlace(data: PlaceModel) {
    let generatedID: string;
    return this._http.post<{ name: string }>(
      "https://ionic-course-project-a4b04.firebaseio.com/offered-places.json",
      data
    ).pipe(
      switchMap(res => {
        generatedID = res.name;
        return this._places;
      }),
      take(1),
      tap(places => {
        places.push(data);
        this.setPlaces(places);
      }));
  }

  editPlace(data: PlaceModel) {
    let updatedPlaces: PlaceModel[];
    return this._places.pipe(
      take(1),
      switchMap(places => {
        let placeIndex = places.findIndex(place => {
          return place.id == data.id;
        });
        places[placeIndex] = data;
        updatedPlaces = places;
        return this._http.put<any>(
          `https://ionic-course-project-a4b04.firebaseio.com/offered-places/${data.id}.json`,
          { ...data, id: null }
        );
      }),
      tap(
        () => {
          this.setPlaces(updatedPlaces);
        }
      ));
  }
}
