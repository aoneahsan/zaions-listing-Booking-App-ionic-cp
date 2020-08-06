// Core Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Ionic Imports
import { IonicModule } from '@ionic/angular';

// Modules
import { NewOfferPageRoutingModule } from './new-offer-routing.module';
import { SharedModule } from 'src/app/module/shared/shared.module';

// Page
import { NewOfferPage } from './new-offer.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewOfferPageRoutingModule,
    SharedModule
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}
