import { Injectable, ApplicationModule } from '@angular/core';
import { AppCompilationModel } from '../../../api/models/AppCompilation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {

  constructor(
    private http: HttpClient
  ) {

  }

  getByAppId(appId: string, callback, errorCallback): void {
    console.log("get by app id", appId);
    this.http.get(`/api/test-case/appid/${appId}`).subscribe(
      (res: any) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  getByID(id: string, callback, errorCallback): void {
    this.http.get(`/api/test-case/${id}`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  create(compilation: AppCompilationModel, callback): void {
    this.http.post('/api/test-case', compilation).subscribe(
      (res) => {
        callback(true);
      },
      (err) => {
        callback(false);
      })
  }

  getContent(fileName: String, callback): void {
    this.http.get(`api/test-case/raw/${fileName}`).subscribe(
      (data) => {
        callback(data);
      }
    )
  }

}