import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  url= environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  add(data: any){
    return this.httpClient.post(this.url+"/reservation/add", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    });
  }

  update(data: any){
    return this.httpClient.patch(this.url+"/reservation/update", data, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }

  getBooking(){
    return this.httpClient.get(this.url+ "/reservation/get");
  }

  delete(id:any){
    return this.httpClient.delete(this.url+"/reservation/delete/" +id, {
      headers: new HttpHeaders().set('Content-type', 'application/json')
    })
  }


}
