import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {CONTENT_ITEMS} from '../content/content-data';
import { API_URL } from './urls';
import { AbstractService } from './abstract.service';
import { OrderModel } from '../content/order/order';
import { ManagerDTO } from '../content/manager/managerDTO';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


export interface myData {
   name:string;
}

@Injectable()
export class OrderService extends AbstractService{
    constructor(private _http: Http){super()}

    saveOrder(order: OrderModel){
            const loginUrl = API_URL+'order';
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            // console.log('User send conf-pass:'+ user.reset_password);
            return this._http.post(loginUrl,JSON.stringify(order),options)
            .map(res => res.json())
            .catch(this._handleError);
    }

    getOrder(id:number){
            let params = new URLSearchParams();
             params.set('orderId',id.toString());
      
        // console.log('User send conf-pass:'+ user.reset_password);
        return this._http.get(API_URL+'order',{search: params})
        .map(res =>  <ManagerDTO[]>res.json())
        .catch(this._handleError)
    }
}