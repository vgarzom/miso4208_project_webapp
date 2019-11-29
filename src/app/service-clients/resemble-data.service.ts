import { Injectable, ApplicationModule } from '@angular/core';
import { TestObject } from '../../../api/models/';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResembleDataService {

  constructor(
    private http: HttpClient
  ) {

  }

  compare(comparisionReq: any, callback, errorCallback): void {
    this.http.post(`/api/resemble`, comparisionReq).subscribe(
      (res) => {
        console.log("res", res);
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }


}