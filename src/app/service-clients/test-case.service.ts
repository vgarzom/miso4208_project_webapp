import { Injectable, ApplicationModule } from '@angular/core';
import { TestCase } from '../../../api/models/TestCase.model';
import { HttpClient } from '@angular/common/http';

const cases = {
  mobile: [
    { type: 'monkeys', name: "Monkeys", content_type: 'text', count: true, seed: true, extension: '' },
    { type: 'calabash', name: "Calabash", content_type: 'file', count: false, seed: false, extension: '.feature' }
  ],
  web: [
    { type: 'cypress', name: "Cypress", content_type: 'file', count: false, seed: false, extension: '.spec.js' },
    { type: 'gremlins', name: "Gremlins", content_type: 'text', count: true, seed: false, extension: '' }
  ]
}

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

  create(testCase: TestCase, callback): void {
    this.http.post('/api/test-case', testCase).subscribe(
      (res) => {
        callback(true);
      },
      (err) => {
        callback(false);
      })
  }

  getContent(type: String, fileName: String, callback): void {
    this.http.get<any>(`api/test-case/raw/${type}/${fileName}`).subscribe(
      (data) => {
        console.log("data", data);
        callback(data.data.replace(new RegExp('\n', 'g'), "<br />"));
      }
    )
  }

  getTestCases(application_type: string): [] {
    return cases[application_type];
  }

}