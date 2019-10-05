import { Injectable } from '@angular/core';
import { MonkeyTest } from '../../../api/models/monkey-test.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MonkeyTestService {

  constructor(
    private http: HttpClient
  ) {}

  getById(id:string, callback, errorCallback): void {
    this.http.get(`/api/monkey-test/${id}`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  getAll(callback, errorCallback): void {
    this.http.get(`/api/monkey-test`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  create(monkeytest: MonkeyTest, callback, errorCallback): void {
    this.http.post('/api/monkey-test', monkeytest).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      })
  }
  
}