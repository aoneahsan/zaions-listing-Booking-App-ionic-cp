// Core Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Ionic Imports
import { NavController, LoadingController } from '@ionic/angular';

// Models
import { PlaceLocation } from './../../location.modal';

// Services
import { AuthService } from 'src/app/auth/auth.service';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place-model';


// Function to convert base64 image into a image file(blob)
function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min((begin + sliceSize), bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})

export class NewOfferPage implements OnInit, OnDestroy {

  form;
  minStartingDate: string = new Date().toISOString();

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

  get invalidDates() {
    if (this.form.get('dateFrom').value && this.form.get('dateTo').value) {
      if (this.form.get('dateFrom').value < this.form.get('dateTo').value) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(180)]),
      price: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      dateFrom: new FormControl(new Date().toISOString(), [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      image: new FormControl(null)
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
    if (!this.invalidDates) {
      console.log("Creating New Offer... == formdata = ", this.form.value);
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
  }

  onLocationPick(locationData: PlaceLocation) {
    this.form.patchValue({ location: locationData });
  }

  onImagePick(imageString: string | File) {
    let selectedImageFile;
    if (typeof imageString === 'string') {
      selectedImageFile = base64toBlob(imageString.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
    }
    else {
      selectedImageFile = imageString;
    }
    this.form.patchValue({ image: selectedImageFile });
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
