import { Injectable, ApplicationModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RedReadCalabashCaseService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(callback, errorCallback): void {
    this.http.get(`/api/calabash-case`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

}