import { BookingModal } from './booking.modal';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    dummyBooking: BookingModal[] = [
        new BookingModal(
            'b1',
            'p1',
            'u1',
            'Lahore',
            'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
            'ahsan',
            'mahmood',
            3,
            new Date("2020-01-01"),
            new Date("2020-11-01")
        ),
        new BookingModal(
            'b2',
            'p2',
            'u2',
            'Lahore 2',
            'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
            'ahsan',
            'mahmood',
            30,
            new Date("2020-01-01"),
            new Date("2020-11-01")
        ),
        new BookingModal(
            'b3',
            'p3',
            'u3',
            'Lahore 3',
            'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
            'ahsan',
            'mahmood',
            13,
            new Date("2020-01-01"),
            new Date("2020-11-01"))
    ];
    private _bookings: BehaviorSubject<BookingModal[]> = new BehaviorSubject<BookingModal[]>(null);

    constructor(
        private _http: HttpClient,
        private _authService: AuthService
    ) { }

    fetchBookings() {
        return this._http.get<{ [key: string]: BookingModal }>(
            `https://ionic-course-project-a4b04.firebaseio.com/bookings.json?orderBy="userID"&equalTo="${this._authService.UserID}"`
        ).pipe(
            map(res => {
                let newBookings: BookingModal[] = [];
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        let newBooking = new BookingModal(
                            key,
                            res[key].placeID,
                            res[key].userID,
                            res[key].placeTitle,
                            res[key].placeImage,
                            res[key].firstname,
                            res[key].lastname,
                            res[key].no_of_guest,
                            new Date(res[key].date_from),
                            new Date(res[key].date_to)
                        );
                        newBookings.push(newBooking);
                    }
                }
                return newBookings;
                // return [];
            }),
            tap(bookings => {
                // console.log("booking data from server = ", bookings);
                this.setBookings(bookings);
            })
        );
    }

    getBookings() {
        return this._bookings;
    }

    setBookings(data: BookingModal[]) {
        this._bookings.next(data);
    }

    getBooking(id: string) {
        let currentBooking = this._bookings.value;
        return { ...currentBooking.find(b => b.id === id) };
    }

    placeBooking(data: BookingModal) {
        return this._http.post<any>(
            `https://ionic-course-project-a4b04.firebaseio.com/bookings.json`,
            { ...data, id: null }
        ).pipe(
            tap(res => {
                let newBooking = new BookingModal(
                    res.name,
                    data.placeID,
                    data.userID,
                    data.placeTitle,
                    data.placeImage,
                    data.firstname,
                    data.lastname,
                    data.no_of_guest,
                    new Date(data.date_from),
                    new Date(data.date_to)
                );
                let bookings = this._bookings.value;
                this.setBookings(bookings.concat(newBooking));
            })
        );
    }

    cancelBooking(bookingID) {
        let bookings = this._bookings.value;
        return this._http.delete<any>(
            `https://ionic-course-project-a4b04.firebaseio.com/bookings/${bookingID}.json`
        ).pipe(
            tap(res => {
                this.setBookings(bookings.filter(el => el.id != bookingID));
            })
        );
    }
}