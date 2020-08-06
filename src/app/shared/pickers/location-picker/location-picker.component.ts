// Core Imports
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Ionic Imports
import { ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { Capacitor, Plugins } from "@capacitor/core";

// Modals
import { PlaceLocation } from './../../../places/location.modal';
import { CoordinatesInterface } from './../../../places/location.modal';

// Environment
import { environment } from './../../../../environments/environment';

// Components
import { MapModalComponent } from './../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})

export class LocationPickerComponent implements OnInit {

  @Output() saveLocation = new EventEmitter<PlaceLocation>();
  selectedPlaceImage: string;
  isLoadingPlaceImg: boolean = false;

  constructor(
    private _modalCtl: ModalController,
    private _http: HttpClient,
    private alertCtl: AlertController,
    private actionSheet: ActionSheetController
  ) { }

  ngOnInit() { }

  onPickLocation() {
    this.actionSheet.create({
      header: "Select Option",
      buttons: [
        { text: "Auto Locate", handler: () => this.autoLocate() },
        { text: "Pick on Map", handler: () => this.pickOnMap() },
        { text: "Cancel", role: "cancel" },
      ]
    }).then(asEl => asEl.present());
  }

  autoLocate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoadingPlaceImg = true;
    Plugins.Geolocation.getCurrentPosition().then(
      geoLocation => {
        const cords: CoordinatesInterface = {
          lat: geoLocation.coords.latitude,
          lng: geoLocation.coords.longitude
        };
        this.createPlace(cords.lat, cords.lng);
        this.isLoadingPlaceImg = false;
      }
    ).catch(
      err => {
        this.isLoadingPlaceImg = false;
        this.showErrorAlert()
      }
    );
  }

  pickOnMap() {
    this._modalCtl.create({
      component: MapModalComponent,
      componentProps: {
        data: "ok"
      }
    }).then(el => {
      el.onDidDismiss().then(res => {
        if (!res.data) {
          return;
        }
        const cords: CoordinatesInterface = res.data;
        this.createPlace(cords.lat, cords.lng);
      });
      el.present();
    });
  }

  createPlace(lat: number, lng: number) {
    const placeAddress: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      mapImageURl: null
    };
    this.isLoadingPlaceImg = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap(address => {
          placeAddress.address = address;
          return of(this.getAddressMapImage(placeAddress.lat, placeAddress.lng, 16));
        }))
      .subscribe(
        imageUrl => {
          placeAddress.mapImageURl = imageUrl;
          this.selectedPlaceImage = imageUrl;
          this.isLoadingPlaceImg = false;
          this.saveLocation.next(placeAddress);
        },
        err => {
          console.log("LocationPickerComponent == getAddress == err = ", err);
          this.alertCtl.create({
            header: 'Error',
            message: "Error Occured, Try again",
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel'
              },
              {
                text: 'Pick Again',
                role: 'open',
                handler: () => {
                  this.onPickLocation();
                }
              }
            ]
          }).then(al => {
            al.present();
          })
        }
      );
  }

  showErrorAlert() {
    this.alertCtl.create({
      header: "Error Occured",
      message: "Something went wrong, try again",
      buttons: [
        { text: 'Okay', role: 'cancel' }
      ]
    }).then(al => al.present());
  }

  getAddress(lat: number, lng: number) {
    return this._http.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPI}`
    ).pipe(map(geoData => {
      // console.log("getAddress == geoData = ", geoData);
      if (geoData && geoData.results && geoData.results.length < 0) {
        return null;
      }
      return geoData.results[0].formatted_address;
    }));
  }

  getAddressMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
      &markers=color:blue%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPI}`;
  }
}
