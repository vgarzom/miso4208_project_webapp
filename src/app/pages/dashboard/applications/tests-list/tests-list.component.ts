import { Component, OnInit, Input } from '@angular/core';
import { TestObject, ApplicationModel } from '../../../../../../api/models'
import { TestObjectService } from '../../../../service-clients/test-object.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss']
})
export class TestsListComponent implements OnInit {
  private _application: TestObject;
  @Input()
  set application(value: ApplicationModel) {
    this._application = value;
    this.getTests();
  }

  get application(): ApplicationModel {
    return this._application;
  }

  tests: TestObject[] = [];

  constructor(
    private testObjectService: TestObjectService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  getTests() {
    this.testObjectService.getByAppID(this.application._id, (result) => {
      this.tests = result;
    }, (err) => {
      console.log("error looking for versions", err)
    });
  }

  selectTest(test) {
    this.router.navigate([`/dashboard/apps/test/${test._id}`]);
  }


}
