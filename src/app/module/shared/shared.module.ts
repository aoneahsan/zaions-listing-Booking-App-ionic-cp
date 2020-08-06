import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { LocationPickerComponent } from 'src/app/shared/pickers/location-picker/location-picker.component';
import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';

@NgModule({
    declarations: [
        CreateBookingComponent,
        MapModalComponent,
        LocationPickerComponent,
        ImagePickerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule
    ],
    exports: [
        CreateBookingComponent,
        MapModalComponent,
        LocationPickerComponent,
        ImagePickerComponent
    ],
    entryComponents: [
        CreateBookingComponent
    ]
})
export class SharedModule { }