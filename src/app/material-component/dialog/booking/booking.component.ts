import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import { ProjectService } from 'src/app/services/project.service';
import { RoomService } from 'src/app/services/room.service';
import { BookingService } from 'src/app/services/booking.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  onAddBooking = new EventEmitter();
  onEditBooking = new EventEmitter();
  bookingForm: any= FormGroup;
  dialogAction: any="Add";
  action: any="Add"
  responseMessage: any;
  rooms: any=[];
  bookings: any=[];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private roomService: RoomService,
  private bookingService: BookingService,
  public dialogRef: MatDialogRef<BookingComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.bookingForm = this.formBuilder.group({
      inbound: [null, [Validators.required]],
      outbound: [null, [Validators.required]],
      roomId: [null, [Validators.required]],
      personFName: [null, [Validators.required]],
    })
    if(this.dialogData.action==="Edit"){
      this.dialogAction="Edit";
      this.action="upadte";
      this.bookingForm.patchValue(this.dialogData.data);
    }
    this.getRooms();
    this.getReservations();
  }

  getRooms(){
    this.roomService.getRoom().subscribe((response)=>{
      this.rooms=response;
    }, (error: any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  getReservations(){
    this.bookingService.getBooking().subscribe((response)=>{
      this.bookings=response;
    },(error: any)=>{
      console.log(error);
    })
  }

  handleSubmit(){
    if(this.dialogAction==="Edit"){
      this.edit();
    }else{
      this.add();
    }
  }

  edit(){
    let formData=this.bookingForm.value;
    let data={
      id: this.dialogData.data.id,
      inbound: formData.inbound,
      outbound: formData.outbound,
      roomId: formData.roomId,
      personFName: formData.personFName
    }
    this.bookingService.update(data).subscribe((response: any)=>{
      this.dialogRef.close();
      this.onEditBooking.emit();
      this.responseMessage=response.message;
      this.snackbarService.openSnackBar(response.message, "success");
    },(error: any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  add(){
    let formData= this.bookingForm.value;
    let data={
      inbound: formData.inbound,
      outbound: formData.outbound,
      roomId: formData.roomId,
      personFName: formData.personFName
    }
    if(this.assertBooking(data)){
      this.bookingService.add(data).subscribe((response: any)=>{
        this.dialogRef.close();
        this.onAddBooking.emit();
        this.responseMessage=response.message;
        this.snackbarService.openSnackBar(response.message, "success");
        }, (error: any)=>{
        if(error.error?.message){
          this.responseMessage=error.error?.message
        }else{
          this.responseMessage=GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
         })
    }else{
      this.responseMessage=GlobalConstants.orderError;
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    }
    
  }
  /**
   * 
   * @param data reservation data
   * @returns true if the client is available for the given dates ;
   */

  assertBooking(data: any){
    const objFrom= new Date(data.inbound);
        const objTo= new Date(data.outbound);
    let isValid= false;
    this.bookings.forEach((booking:any)=>{
      if(booking.personFName===data.personFName){
        const from= new Date(booking.inbound);
        const to= new Date(booking.outbound);    
        if(
          (objFrom.getTime()>=from.getTime()&&objFrom.getTime()<=to.getTime())
        ||
        (objTo.getTime()>=from.getTime()&&objTo.getTime()<= to.getTime())
        ){
         isValid=false;
        }else
        isValid=true;
      }
      return isValid;
    })
return isValid;
  }

}
