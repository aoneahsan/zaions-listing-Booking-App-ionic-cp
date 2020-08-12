import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutDeveloperPage } from './about-developer.page';

const routes: Routes = [
  {
    path: '',
    component: AboutDeveloperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutDeveloperPageRoutingModule {}
