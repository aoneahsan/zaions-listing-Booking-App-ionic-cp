import { BookingModal } from './booking.modal';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private _bookings: BookingModal[] = [
        new BookingModal('b1', 'p1', 'u1', 'Lahore', 3),
        new BookingModal('b2', 'p2', 'u2', 'Lahore 2', 30),
        new BookingModal('b3', 'p3', 'u3', 'Lahore 3', 13)
    ]

    constructor() {}

    get bookings() {
        return [...this._bookings];
    }

    getBooking(id: string) {
        return {...this._bookings.find(b => b.id === id)};
    }

}