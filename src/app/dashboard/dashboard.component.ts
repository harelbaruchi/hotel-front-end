import { Component, AfterViewInit, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { DashboardService } from '../services/dashboard.service';
import { HotelService } from '../services/hotel.service';
import { RoomService } from '../services/room.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	responseMessage: any;
	data: any;

	ngOnInit(){
this.dashboardData();
}
	
	

	constructor(private dashboardService: DashboardService,
		 private snackbarService: SnackbarService,
		 private hotelService: HotelService,
		 private roomService: RoomService,
		 private bookingService: BookingService) {
	}

	dashboardData(){
		this.hotelService.getHotel().subscribe((response: any)=>{
			let counter=0;
			for(const obj of response){
				if(obj.id){
					counter++
				}
			}
			GlobalConstants.hotelCount=counter;
		})
		this.roomService.getRoom().subscribe((response: any)=>{
			let counter=0;
			for(const obj of response){
				if(obj.hotelId){
					counter++
				}
			}
			GlobalConstants.roomCount=counter;
		})
		this.bookingService.getBooking().subscribe((response: any)=>{
			let counter=0;
			for(const obj of response){
				if(obj.roomId){
					counter++
				}
			}
			GlobalConstants.bookingCount=counter;
		})
 this.data={
	room: GlobalConstants.roomCount,
	hotel: GlobalConstants.hotelCount,
	reservation: GlobalConstants.bookingCount
 }
 	return this.data;
}
}
