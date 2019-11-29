import { Injectable, ApplicationModule } from '@angular/core';
import { TestObject } from '../../../api/models/';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestObjectService {

  constructor(
    private http: HttpClient
  ) {

  }

  getByAppID(appId: String, callback, errorCallback): void {
    this.http.get(`/api/tests/appid/${appId}`).subscribe(
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
    this.http.get(`/api/tests/id/${id}`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  create(testObject: TestObject, callback): void {
    this.http.post('/api/tests', testObject).subscribe(
      (res) => {
        callback(true);
      },
      (err) => {
        callback(false);
      })
  }

  getLog(testId: String, callback): void {
    this.http.get<any>(`api/tests/raw/${testId}`).subscribe(
      (data) => {
        if (data.code !== 200) {
          callback("Not log found")
        }
        callback(data.data.replace(new RegExp('\n', 'g'), "<br />"));
      }
    )
  }

}