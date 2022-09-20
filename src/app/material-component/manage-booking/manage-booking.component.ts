import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { CommentService } from 'src/app/services/comment.service';
import { RoomService } from 'src/app/services/room.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BookingComponent } from '../dialog/booking/booking.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { RoomComponent } from '../dialog/room/room.component';


@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {
  displayedColumns: string[]= ['personFName','hotelName','roomType','inbound','outbound',"edit"]
  dataSource: any;
  responseMessage: any;

  constructor(private bookingService: BookingService,
      private dialog: MatDialog,
      private snackbarService: SnackbarService,
      private router: Router) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData(){
    this.bookingService.getBooking().subscribe((response: any)=>{
      this.dataSource= new MatTableDataSource(response);
    }, (error: any)=>{
      console.log(error);
    if(error.error?.message){
      this.responseMessage= error.error?.message;
    }
    else{
      this.responseMessage=GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  applyFilter(event: Event){
    const filterValue= (event.target as HTMLInputElement).value;
    this.dataSource.filter= filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      action: 'Add'
    }
    dialogConfig.width= "700px";
    const dialogRef= this.dialog.open(BookingComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub= dialogRef.componentInstance.onAddBooking.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values: any){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      action: "Edit", data: values
    }
    dialogConfig.width= "700px";
    const dialogRef= this.dialog.open(BookingComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub= dialogRef.componentInstance.onEditBooking.subscribe((response)=>{
      this.tableData();
    })
  }

  handleDeleteAction(values: any){
    const dialogConfig= new MatDialogConfig();
        dialogConfig.data= {
          message: 'delete '  +values.type+  ' reservation'
        }
        const dialogRef= this.dialog.open(ConfirmationComponent,dialogConfig);
        const sub= dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
        this.deleteBooking(values.id);
         dialogRef.close(); 
        })
  }



  deleteBooking(id: any){
    this.bookingService.delete(id).subscribe((response: any)=>{
      this.tableData();
      this.responseMessage= response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'successfully deleted');
    }, (error: any)=>{
      if(error.error?.message){
        this.responseMessage= error.error?.message;
      }
      else{
        this.responseMessage= GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }



}
