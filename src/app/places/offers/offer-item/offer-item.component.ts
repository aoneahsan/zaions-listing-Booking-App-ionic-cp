import { Component, OnInit, Input } from '@angular/core';
import { PlaceModel } from '../../place-model';
import { IonItemSliding, NavController } from '@ionic/angular';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {

  @Input() place: PlaceModel;
  // @Input()

  constructor(private _navCtl: NavController) { }

  ngOnInit() { }


  onEdit(item: PlaceModel, slidingItem: IonItemSliding) {
    slidingItem.close();
    this._navCtl.navigateForward('/places/tabs/offers/' + item.id);
  }
}
