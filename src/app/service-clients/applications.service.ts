import { Injectable, ApplicationModule } from '@angular/core';
import { ApplicationModel } from '../../../api/models/Application';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  constructor(
    private http: HttpClient
  ) {

  }

  getByUserID(userId: number, callback, errorCallback): void {
    this.http.get(`/api/applications/byuserid/${userId}`).subscribe(
      (res) => {
        console.log("res", res);
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  getByID(id: string, callback, errorCallback): void {
    this.http.get(`/api/applications/${id}`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  create(app: ApplicationModel, callback): void {
    this.http.post('/api/applications', app).subscribe(
      (res) => {
        callback(true);
      },
      (err) => {
        callback(false);
      })
  }

}