export class BookingModal {
    constructor(
        public id: string,
        public placeID: string,
        public userID: string,
        public placeTitle: string,
        public placeImage: string,
        public firstname: string,
        public lastname: string,
        public no_of_guest: number,
        public date_from: Date,
        public date_to: Date
    ) {}
}