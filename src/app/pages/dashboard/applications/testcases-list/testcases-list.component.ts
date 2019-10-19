import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ApplicationModel, TestCaseModel } from '../../../../../../api/models';
import { ApplicationsService } from 'src/app/service-clients/applications.service';
import { TestCaseService } from 'src/app/service-clients/test-case.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-testcases-list',
  templateUrl: './testcases-list.component.html',
  styleUrls: ['./testcases-list.component.scss']
})
export class TestcasesListComponent implements OnInit {
  public Editor = ClassicEditor;
  private _application: ApplicationModel;
  selected_file: String = "";
  loadingFile: boolean = false;
  visible: boolean = false;
  newtest_visible: boolean = false;
  @Input()
  set application(value: ApplicationModel) {
    this._application = value;
    this.getCases();
  }

  get application(): ApplicationModel {
    return this._application;
  }

  cases: TestCaseModel[] = [];

  constructor(
    private testCaseService: TestCaseService
  ) { }

  ngOnInit() {
  }

  getCases() {
    this.testCaseService.getByAppId(this.application._id, (result) => {
      this.cases = result;
    }, (err) => {
      console.log("error looking for versions")
    });
  }

  selectFile(c: TestCaseModel) {
    this.loadingFile = true;
    this.visible = true;
    this.testCaseService.getContent(c.file_name, (data) => {
      this.selected_file = data;
      this.loadingFile = false;
    })
  }

}
