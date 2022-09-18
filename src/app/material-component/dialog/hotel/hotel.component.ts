import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotelService } from 'src/app/services/hotel.service';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {

  onAddHotel= new EventEmitter();
  onEdditHotel= new EventEmitter();
  hotelForm: any= FormGroup;
  dialogAction: any = "Add";
  action: any="Add";
  responseMessage: any; 

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder, private hotelService: HotelService,
    private dialogRef: MatDialogRef<HotelComponent>,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.hotelForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      image: [null, [Validators.required]],
    });
    if(this.dialogData.action==='Edit'){
      this.dialogAction="Edit";
      this.action="update";
      this.hotelForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction==='Edit'){
        this.edit();
    }else{
      this.add();
    }
  }

  add(){
    let formData= this.hotelForm.value;
    let data={
      name:formData.name,
      address: formData.address,
      image: formData.image
    }
    this.hotelService.add(data).subscribe((response: any)=>{
      this.dialogRef.close();
      this.onAddHotel.emit();
      this.responseMessage=response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit(){
    let formData= this.hotelForm.value;
    let data={
      id:this.dialogData.data.id,
      name:formData.name,
      address: formData.address,
      endDate: formData.endDate,
      status: formData.status,
      image: formData.image,
    }
    this.hotelService.update(data).subscribe((response: any)=>{
      this.dialogRef.close();
      this.onEdditHotel.emit();
      this.responseMessage=response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
