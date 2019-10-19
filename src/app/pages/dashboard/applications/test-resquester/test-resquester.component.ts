import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter, ApplicationModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile, NzMessageService, UploadFilter } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpHeaderResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationModel, User, TestCaseModel, AppCompilationModel } from '../../../../../../api/models';
import { AppCompilationService } from 'src/app/service-clients/app-compilation.service';
import { TestCaseService } from 'src/app/service-clients/test-case.service';
import { TestObjectService } from 'src/app/service-clients/test-object.service';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';


@Component({
  selector: 'app-test-resquester',
  templateUrl: './test-resquester.component.html',
  styleUrls: ['./test-resquester.component.scss']
})
export class TestResquesterComponent implements OnInit {
  @Output() onRequestCreated: EventEmitter<void> = new EventEmitter();
  loadingStatus: string = "new-request";
  cases: TestCaseModel[];
  compilations: AppCompilationModel[] = [];
  validateForm: FormGroup;
  fileList: UploadFile[] = [];
  user: User;

  types: any[] = [
    {value: "cypress", name: "Cypress"},
    {value: "gremlims", name: "Gremlims"},
    {value: "calabash", name: "Calabash"},
  ]

  private _application: ApplicationModel;
  @Input()
  set application(value: ApplicationModel) {
    this._application = value;
    this.validateForm = this.fb.group({
      app_compilation_id: [null, [Validators.required]],
      case_id: [null, [Validators.required]],
      type: [null, [Validators.required]]
    });
    this.getCases();
    this.getCompilations();
  }

  get application(): ApplicationModel {
    return this._application;
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private appCompilationService: AppCompilationService,
    private testCaseService: TestCaseService,
    private testObjectService: TestObjectService,
    private currentUserService: CurrentUserService,
    private msg: NzMessageService
  ) {

  }

  ngOnInit() {
    this.currentUserService.getCurrentUser((u) => {
      this.user = u;
    })
  }

  ngAfterContentInit() {
  }

  getCases() {
    this.testCaseService.getByAppId(this.application._id, (result) => {
      this.cases = result;
    }, (err) => {
      console.log("error looking for versions")
    });
  }

  getCompilations() {
    this.appCompilationService.getByAppId(this.application._id, (result) => {
      this.compilations = result;
    }, (err) => {
      console.log("error looking for versions")
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return;
    }

    this.testObjectService.create(
      {
        user_id: this.user._id,
        case_id: this.validateForm.get('case_id').value,
        app_id: this.application._id,
        app_compilation_id: this.validateForm.get('app_compilation_id').value,
        type: this.validateForm.get('type').value
      },
      (result) => { 
        if (result) {
          this.msg.success('Solicitud creada satisfactoriamente');
          this.onRequestCreated.emit();
        } else {
          this.msg.error('Ocurrió un error al crear la solicitud.');
        }
      }
    );
    
  }


}
