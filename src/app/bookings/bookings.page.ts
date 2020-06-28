import { BookingService } from './bookings.service';
import { BookingModal } from './booking.modal';
import { Component, OnInit } from '@angular/core';
import { NavController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  loadedBookings: BookingModal[];

  constructor(private _bookingService: BookingService, private _navCtl: NavController) { }

  ngOnInit() {
    this.loadedBookings = this._bookingService.bookings;

  }

  IonViewWillEnter() {
  }

  onCancelBooking(item: BookingModal, slidingItem: IonItemSliding) {
    slidingItem.close();
    alert("Cancel Booking");
  }

}
