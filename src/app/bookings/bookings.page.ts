import { BookingService } from './bookings.service';
import { BookingModal } from './booking.modal';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, IonItemSliding, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: BookingModal[];
  loadingBookingSub: Subscription;
  fetchBookingSub: Subscription;
  cancelBookingSub: Subscription;

  errorOccured:boolean = false;

  constructor(
    private _bookingService: BookingService,
    private _navCtl: NavController,
    private _loadingCtl: LoadingController,
    private _alertCtl: AlertController
  ) { }

  ngOnInit() {
    this.loadingBookingSub = this._bookingService.getBookings().subscribe(
      res => {
        this.loadedBookings = res;
      },
      err => {
        alert("BookingsPage == Error Occured while getting bookings.");
      }
    );
  }

  ionViewWillEnter() {
    // console.log("working...");
    this.fetchBookingSub = this._bookingService.fetchBookings().subscribe(
      res => {
      },
      err => {
        alert("Error Occured while fetching bookings.");
        this.errorOccured = true;
        // this.loadedBookings = [];
      }
    );
  }

  onCancelBooking(item: BookingModal, slidingItem: IonItemSliding) {
    this._alertCtl.create({
      header: "Cancel Booking",
      message: "Do you want to cancel this booking?",
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: "Yes",
          role: 'delete',
          handler: () => {
            this.processCancelBooking(item, slidingItem);
          }
        },
      ]
    }).then(alertEl => {
      alertEl.present();
    })
  }

  processCancelBooking(item: BookingModal, slidingItem: IonItemSliding) {
    this._loadingCtl.create({message: 'Cancelling Booking...'}).then(loadingEl => {
      loadingEl.present();
      slidingItem.close();
      this.cancelBookingSub = this._bookingService.cancelBooking(item.id).subscribe(
        res => {
          loadingEl.dismiss();
        },
        err => {
          alert("BookingsPage == Error while cancelling booking.");
        }
      );
    });
  }

  ngOnDestroy(): void {
    if (this.loadingBookingSub) {
      this.loadingBookingSub.unsubscribe();
    }
    if (this.cancelBookingSub) {
      this.cancelBookingSub.unsubscribe();
    }
    if (this.fetchBookingSub) {
      this.fetchBookingSub.unsubscribe();
    }
  }
}
