import { Injectable, ApplicationModule } from '@angular/core';
import { CypressTest } from '../../../api/models/cypress-test.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TodoistCypressCaseService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(callback, errorCallback): void {
    this.http.get(`/api/cypress-case`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

}