import { BookingModal } from './../../../bookings/booking.modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlaceModel } from '../../place-model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { isEmpty } from 'rxjs/operators';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: PlaceModel = null;
  placeID: string;

  private placeBookingSub: Subscription;
  userID;

  loadedBookings: BookingModal[];
  private loadedPlacesSub: Subscription;
  private fetchPlacesSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _navCtl: NavController,
    private _placesService: PlacesService,
    private _modalCtl: ModalController,
    private _actionSheetCtl: ActionSheetController,
    private _loadingCtl: LoadingController,
    private _bookingService: BookingService,
    private _authService: AuthService,
    private _alertCtl: AlertController
  ) { }

  ngOnInit() {
    this._route.paramMap.subscribe(
      params => {
        if (!params.has('placeID')) {
          this._navCtl.navigateBack('/places/tabs/offers');
          return;
        }
        this.placeID = params.get('placeID');
      }
    );
    this.userID = this._authService.UserID;
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
              message: "No place found.",
              buttons: [
                {
                  text: "Okay",
                  role: 'cancel',
                  handler: () => {
                    this._navCtl.navigateRoot(['/places/tabs/discover']);
                  }
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          }
          else {
            this.place = data;
          }
        }
      }
    );
  }

  onBook() {
    // this._router.navigateByUrl('/places/tabs/discover');
    // this._navCtl.navigateBack('/places/tabs/discover');
    // this._navCtl.pop();
    this._actionSheetCtl.create({
      header: 'Select Option',
      buttons: [
        {
          text: 'Select Date',
          handler: () => this.openBookingModal('select')
        },
        {
          text: 'Random Date',
          handler: () => this.openBookingModal('random')
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(
      obj => {
        obj.present();
      }
    );
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this._modalCtl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    }).then(
      modalObject => {
        modalObject.present();
        return modalObject.onDidDismiss();
      }
    ).then(
      modalResponse => {
        if (modalResponse.role === 'book') {
          // console.log(modalResponse.data);
          this._loadingCtl.create({ message: 'Placing Booking...' }).then(loadingEl => {
            loadingEl.present();
            this.placeBookingSub = this._bookingService.placeBooking(modalResponse.data).subscribe(
              res => {
                loadingEl.dismiss();
                this._navCtl.navigateRoot(['/bookings']);
              },
              err => {
                console.log("PlaceDetailPage == err = ", err);
                alert("Error Occured, while booking place.");
              }
            );
          })
        }
      }
    );
  }

  openPlaceMapModal() {
    this._modalCtl.create({
      component: MapModalComponent,
      componentProps: {
        center: {
          lat: this.place.location.lat,
          lng: this.place.location.lng
        },
        modalTitle: this.place.location.address,
        closeBtnText: 'Close',
        selectable: false
      }
    }).then(modalEl => {
      modalEl.present();
    })
  }

  ngOnDestroy(): void {
    if (this.placeBookingSub) {
      this.placeBookingSub.unsubscribe();
    }
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
    if (this.fetchPlacesSub) {
      this.fetchPlacesSub.unsubscribe();
    }
  }
}
