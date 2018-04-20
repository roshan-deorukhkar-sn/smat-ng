import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Response, Request, Headers} from '@angular/http';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  
  constructor(private http: HttpClient) { }
  
  getData(url:string, params:any) {
    return this.http.get(url)
      .map((response : Response) => response)
  }
}


