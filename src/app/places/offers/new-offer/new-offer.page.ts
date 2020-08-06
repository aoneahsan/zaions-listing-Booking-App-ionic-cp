import { PlaceLocation } from './../../location.modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlaceModel } from '../../place-model';
import { AuthService } from 'src/app/auth/auth.service';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit, OnDestroy {

  form;

  creatingPlaceSub: Subscription;
  selectedImageURL: string;

  private loadedPlacesSub: Subscription;
  private fetchPlacesSub: Subscription;

  constructor(
    private _navCtl: NavController,
    private _loadingCtl: LoadingController,
    private _placesService: PlacesService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(180)]),
      price: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      dateFrom: new FormControl(null, [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required])
    })
  }

  ionViewWillEnter() {
    this.loadedPlacesSub = this._placesService.getPlaces().subscribe(
      res => {
        if (!!!res) {
          this.fetchPlacesSub = this._placesService.fetchPlaces().subscribe();
        }
      }
    );
  }

  onCreateOffer() {
    // console.log("Creating New Offer... == formdata = ", this.form.value);
    let newPlace = new PlaceModel(
      Math.random().toString(),
      this.form.value.title,
      this.form.value.description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      this.form.value.price,
      this.form.value.dateFrom,
      this.form.value.dateTo,
      this._authService.UserID,
      this.form.value.location
    );
    this._loadingCtl.create({ message: 'Creating Place...' }).then(loadingEl => {
      loadingEl.present();
      this.creatingPlaceSub = this._placesService.addPlace(newPlace).subscribe(
        res => {
          this.form.reset();
          loadingEl.dismiss();
          this._navCtl.navigateBack('places/tabs/offers');
        }
      );
    });
  }

  onLocationPick(locationData: PlaceLocation) {
    this.form.patchValue({ location: locationData });
  }

  onImagePick(imageString) {
    this.selectedImageURL = imageString;
  }

  ngOnDestroy(): void {
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
    if (this.fetchPlacesSub) {
      this.fetchPlacesSub.unsubscribe();
    }
  }
}
