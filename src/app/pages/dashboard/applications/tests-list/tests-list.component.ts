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
  visible = false;
  visibleLog = false;
  loadingFile = false;
  selected_file;
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
      console.log("tests", this.tests);
    }, (err) => {
      console.log("error looking for versions", err)
    });
  }

  selectTest(test) {
    if (test.type === 'monkeys' || test.type === 'calabash') {
      this.loadingFile = true;
      this.visibleLog = true;
      this.testObjectService.getLog(test._id, (data) => {
        this.selected_file = data;
        this.loadingFile = false;
      })
    }
    else
      this.router.navigate([`/dashboard/apps/test/${test._id}`]);
  }


}
