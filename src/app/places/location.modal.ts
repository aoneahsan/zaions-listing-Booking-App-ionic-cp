export interface CoordinatesInterface {
    lat: number,
    lng: number
}

export interface PlaceLocation extends CoordinatesInterface{
    address: string,
    mapImageURl: string
}