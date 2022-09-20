import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';


import { ManageHotelComponent } from './manage-hotel/manage-hotel.component';
import { HotelComponent } from './dialog/hotel/hotel.component';
import { ManageRoomComponent } from './manage-room/manage-room.component';
import { RoomComponent } from './dialog/room/room.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { BookingComponent } from './dialog/booking/booking.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  declarations: [
    ConfirmationComponent,
    ManageHotelComponent,
    HotelComponent,
    ManageRoomComponent,
    RoomComponent,
    ManageBookingComponent,
    BookingComponent 
  ]
})
export class MaterialComponentsModule {}
