import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from 'src/app/services/comment.service';
import { HotelService } from 'src/app/services/hotel.service';
import { ProjectService } from 'src/app/services/project.service';
import { RoomService } from 'src/app/services/room.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  onAddRoom= new EventEmitter();
  onEditRoom= new EventEmitter();
  roomForm:any= FormGroup;
  dialogAction:any="Add";
  action: any="Add";
  responseMessage:any;
  hotels: any =[];



  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private roomService: RoomService,
  public dialogRef: MatDialogRef<RoomComponent>,
  private hotelService: HotelService,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.roomForm= this.formBuilder.group({
      type: [null, [Validators.required]],
      hotelId: [null, [Validators.required]],
      availableCount: [null, [Validators.required]]
    })
    if(this.dialogData.action==='Edit'){
      this.dialogAction="Edit";
      this.action="update";
      this.roomForm.patchValue(this.dialogData.data);
    }
    this.getHotels();
  }

  getHotels(){
    this.hotelService.getHotel().subscribe((response)=>{
      this.hotels=response;
    }, (error: any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  handleSubmit(){
    if(this.dialogAction==="Edit"){
      this.edit();
    } else{
      this.add();
    }
  }

  edit(){
    let formData= this.roomForm.value;
    let data={
      id: this.dialogData.data.id,
      type: formData.type,
      hotelId: formData.hotelId,
      availableCount: formData.availableCount
    }
    this.roomService.update(data).subscribe((response: any)=>{
      this.dialogRef.close();
      this.onEditRoom.emit();
      this.responseMessage= response.message;
      this.snackbarService.openSnackBar(response.message, 'Success');
    }, (error: any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  add(){
    let formData= this.roomForm.value;
    let data={
      type: formData.type,
      hotelId: formData.hotelId,
      availableCount: formData.availableCount
    }
    this.roomService.add(data).subscribe((response: any)=>{
      this.dialogRef.close();
      this.onAddRoom.emit();
      this.responseMessage= response.message;
      this.snackbarService.openSnackBar(response.message, 'Success');
    },(error: any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}
