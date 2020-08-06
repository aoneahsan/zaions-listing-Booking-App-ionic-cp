import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaceModel } from '../../place-model';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: PlaceModel = null;
  placeID: string;
  form;

  editingPlaceSub: Subscription;

  private loadedPlacesSub: Subscription;
  private fetchPlacesSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _navCtl: NavController,
    private _placesService: PlacesService,
    private _loadingCtl: LoadingController,
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
            this.initForm(this.place);
          }
        }
      }
    );
  }

  initForm(place: PlaceModel) {
    this.form = new FormGroup({
      title: new FormControl(place.name, [Validators.required]),
      description: new FormControl(place.description, [Validators.required, Validators.maxLength(180)])
      // price: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      // dateFrom: new FormControl(null, [Validators.required]),
      // dateTo: new FormControl(null, [Validators.required])
    });
  }

  onEditOffer() {
    let newPlace = new PlaceModel(
      this.place.id,
      this.form.value.title,
      this.form.value.description,
      this.place.image,
      this.place.price,
      this.place.available_from,
      this.place.available_to,
      this.place.userID,
      this.place.location
    );
    this._loadingCtl.create({ message: 'Updating Place...' }).then(loadingEl => {
      loadingEl.present();
      this.editingPlaceSub = this._placesService.editPlace(newPlace).subscribe(
        res => {
          this.form.reset();
          loadingEl.dismiss();
          this._navCtl.navigateBack(['/places/tabs/offers/' + this.place.id]);
        }
      );
    });
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