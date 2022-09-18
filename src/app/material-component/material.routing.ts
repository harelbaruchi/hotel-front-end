import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageHotelComponent } from './manage-hotel/manage-hotel.component';
import { ManageRoomComponent } from './manage-room/manage-room.component';



export const MaterialRoutes: Routes = [
    
    {
        path: 'hotel',
        component: ManageHotelComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole:['admin','user']
        }
    },
    {
        path: 'room',
        component: ManageRoomComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole:['admin','user']
        }
    }

];
