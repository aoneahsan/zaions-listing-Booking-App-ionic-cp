import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutDeveloperPageRoutingModule } from './about-developer-routing.module';

import { AboutDeveloperPage } from './about-developer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutDeveloperPageRoutingModule
  ],
  declarations: [AboutDeveloperPage]
})
export class AboutDeveloperPageModule {}
