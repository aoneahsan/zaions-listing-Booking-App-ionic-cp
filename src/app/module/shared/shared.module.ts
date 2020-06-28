import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';

@NgModule({
    declarations: [
        CreateBookingComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        CreateBookingComponent
    ],
    entryComponents: [
        CreateBookingComponent
    ]
})
export class SharedModule { }