import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  url = environment.apiUrl;

  constructor( private httpClient: HttpClient) { }

  add(data: any ){
    return this.httpClient.post(this.url+ "/hotel/add/", data, {
      headers: new HttpHeaders().set('Content-type','application/json')
    })
  }

  update(data: any){
    return this.httpClient.patch(this.url+ "/hotel/update/", data,{
      headers: new HttpHeaders().set('Content-type','application/json')
    })
  }

  getHotel(){
    return this.httpClient.get(this.url+"/hotel/get");
  }

}
