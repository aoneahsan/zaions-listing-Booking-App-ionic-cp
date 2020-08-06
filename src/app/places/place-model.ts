import { PlaceLocation } from './location.modal';
export class PlaceModel {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public image: string,
        public price: number,
        public available_from: Date,
        public available_to: Date,
        public userID: string,
        public location: PlaceLocation
    ) { }
}