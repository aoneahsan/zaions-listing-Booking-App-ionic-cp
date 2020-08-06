import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';

import { OfferItemComponent } from './offer-item/offer-item.component';

@NgModule({
  declarations: [
    OffersPage,
    OfferItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffersPageRoutingModule
  ]
})
export class OffersPageModule {}
