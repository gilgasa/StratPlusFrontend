import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { User } from '../models/User'


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public url;
  public user : User;
  public token;
  public identity;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  send_message(message):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'messenger',message,{headers:headers});
  }

  visto(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.put(this.url+'visto/'+id,{headers:headers});
  }

  last_messages(para,de):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'last-msm/'+para+'/'+de,{headers:headers});
  }


}
