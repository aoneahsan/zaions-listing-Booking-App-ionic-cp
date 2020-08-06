import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditOfferPage } from './edit-offer.page';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: EditOfferPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class EditOfferPageRoutingModule {}
