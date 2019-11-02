import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter, ApplicationModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile, NzMessageService, UploadFilter } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpHeaderResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationModel, TestCaseModel } from '../../../../../../api/models';
import { AppCompilationService } from 'src/app/service-clients/app-compilation.service';
import { TestCaseService } from 'src/app/service-clients/test-case.service';



@Component({
  selector: 'app-upload-test-case',
  templateUrl: './upload-test-case.component.html',
  styleUrls: ['./upload-test-case.component.scss']
})
export class UploadTestCaseComponent implements OnInit {
  @Output() onTestCaseCreated: EventEmitter<void> = new EventEmitter();
  private _application: ApplicationModel;
  @Input()
  set application(value: ApplicationModel) {
    this._application = value;
    if (this._application.type === 'web') {
      this.validateForm = this.fb.group({
        type: [null, [Validators.required]],
        name: [null, [Validators.required]],
        description: [null, [Validators.required]],
        count: [null, [Validators.min(1000)]],
        seed: [null]
      });
    }
  }

  get application(): ApplicationModel {
    return this._application;
  }

  loadingStatus: string = "new-case";
  validateForm: FormGroup;
  fileList: UploadFile[] = [];
  uploading: boolean = false;
  uploadPercentage: number = 0;
  cases: TestCaseModel[] = [];

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private testCaseService: TestCaseService
  ) {

  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      type: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      count: [null, [Validators.min(1000)]],
      seed: [null]
    });
  }


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      console.log("form invalid");
      return;
    }
    if (this.validateForm.get('type').value.content_type === 'file') {
      console.log("trying to upload file");
      this.handleUpload();
      return;
    }

    console.log("sending data directly");
    let c = {
      name: this.validateForm.controls['name'].value,
      description: this.validateForm.controls['description'].value,
      file_name: null,
      app_id: this.application._id,
      type: this.validateForm.controls['type'].value.type,
      count: this.validateForm.get('count').value,
      seed: this.validateForm.get('seed').value
    }
    this.testCaseService.create(c, (result) => {
      if (result) {
        this.msg.success('Caso de prueba creado satisfactoriamente.');
        this.onTestCaseCreated.emit();
        this.validateForm.reset();
      } else {
        this.msg.error("No fue posible crear el caso de prueba. Intenta nuevamente");
      }
    });
  }

  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => {
          let index = w.name.indexOf(this.validateForm.get('type').value['extension']);
          return index === -1 ? 0 : 1
        });
        if (filterFiles.length !== fileList.length) {
          this.msg.error(`Por favor selecciona un archivo con extensión ${this.validateForm.get('type').value['extension']}`);
          return filterFiles;
        }
        return fileList;
      }
    },
    {
      name: 'async',
      fn: (fileList: UploadFile[]) => {
        return new Observable((observer: Observer<UploadFile[]>) => {
          // doing
          observer.next(fileList);
          observer.complete();
        });
      }
    }
  ];

  handleUpload(): void {

    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.uploading = true;
    this.uploadPercentage = 0;
    // You can use any AJAX library you like

    let c = {
      name: this.validateForm.controls['name'].value,
      description: this.validateForm.controls['description'].value,
      file_name: this.makeid(12) + this.validateForm.get('type').value['extension'],
      app_id: this.application._id,
      type: this.validateForm.controls['type'].value.type,
      count: this.validateForm.get('count').value,
      seed: this.validateForm.get('seed').value
    }
    console.log("c", c);
    const headers = new HttpHeaders({
      test_case_data: JSON.stringify(c),
      test_case_name: c.file_name
    });
    const req = new HttpRequest('POST', '/api/test-case/upload', formData, {
      reportProgress: true,
      headers: headers
    });

    this.http
      .request(req)
      .pipe(
        map(event => {
          console.log("event", event);
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadPercentage = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpHeaderResponse) {
            if (event.status === 200) {
              this.uploading = false;
              this.fileList = [];
              this.validateForm = this.fb.group({
                name: [null, [Validators.required]],
                description: [null, [Validators.required]]
              });
              this.msg.success('Caso de prueba creado satisfactoriamente.');
              this.onTestCaseCreated.emit();
            } else {
              this.uploading = false;
              this.msg.error('Ocurrió un error al crear el caso de prueba.');
            }
          }
        })

      )
      .subscribe(
        () => {

        },
        () => {

        }
      );
  }

  getTestCases() {
    return this.testCaseService.getTestCases(this.application.type);
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  isSubmitButtonDisabled() {
    if (this.validateForm.get('type').value !== null && this.validateForm.get('type').value.content_type === 'text') {
      return false;
    }

    if (this.validateForm.get('type').value !== null && this.validateForm.get('type').value.content_type === 'file') {
      return this.fileList.length === 0;
    }

    return this.uploading;
  }
}
