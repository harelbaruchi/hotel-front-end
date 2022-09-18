import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { RoomService } from 'src/app/services/room.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { RoomComponent } from '../dialog/room/room.component';

@Component({
  selector: 'app-manage-room',
  templateUrl: './manage-room.component.html',
  styleUrls: ['./manage-room.component.scss']
})
export class ManageRoomComponent implements OnInit {
  displayedColumns: string[] = ['type','hotelName','availableCount', "edit"];
  dataSource:any;
  responseMessage:any;


  constructor(private roomService: RoomService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData(){
    this.roomService.getRoom().subscribe((response: any)=>{
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
    dialogConfig.data= {
      action: 'Add'
    }
    dialogConfig.width="700px";
    const dialogRef= this.dialog.open(RoomComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();

    })
    const sub= dialogRef.componentInstance.onAddRoom.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values: any){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data= {
      action: 'Edit', data: values
    }
    dialogConfig.width="700px";
    const dialogRef= this.dialog.open(RoomComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();

    })
    const sub= dialogRef.componentInstance.onEditRoom.subscribe((response)=>{
      this.tableData();
    })
  }

  handleDeleteAction(values: any){
    const dialogConfig= new MatDialogConfig();
        dialogConfig.data= {
          message: 'delete '  +values.type+  ' room'
        }
        const dialogRef= this.dialog.open(ConfirmationComponent,dialogConfig);
        const sub= dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
        this.deleteRoom(values.id);
         dialogRef.close(); 
        })
  }

  deleteRoom(id: any){
    this.roomService.delete(id).subscribe((response: any)=>{
      this.tableData();
      this.responseMessage= response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, 'successfully deleted');
    }, (error: any)=>{
      console.log(error);
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
