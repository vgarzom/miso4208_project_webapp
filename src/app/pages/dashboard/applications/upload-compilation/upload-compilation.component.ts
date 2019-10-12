import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter, ApplicationModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile, NzMessageService, UploadFilter } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpHeaderResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationModel, User } from '../../../../../../api/models';
import { AppCompilationService } from 'src/app/service-clients/app-compilation.service';

@Component({
  selector: 'app-upload-compilation',
  templateUrl: './upload-compilation.component.html',
  styleUrls: ['./upload-compilation.component.scss']
})
export class UploadCompilationComponent implements OnInit, AfterContentInit {
  @Output() onCompilationCreated: EventEmitter<void> = new EventEmitter();
  loadingStatus: string = "new-compilation";
  validateForm: FormGroup;
  fileList: UploadFile[] = [];
  uploading: boolean = false;
  uploadPercentage: number = 0;

  private _application: ApplicationModel;
  @Input()
  set application(value: ApplicationModel) {
    this._application = value;
    if (this._application.type === 'web') {
      this.validateForm = this.fb.group({
        version: [null, [Validators.required]],
        description: [null, [Validators.required]],
        url: [null, [Validators.required]]
      });
    }
  }

  get application(): ApplicationModel {
    return this._application;
  }



  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private appCompilationService: AppCompilationService,
    private msg: NzMessageService
  ) {

  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      version: [null, [Validators.required]],
      description: [null, [Validators.required]],
      url: [null, []]
    })
  }

  ngAfterContentInit() {
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return;
    }

    if (this.application.type === 'mobile') {
      this.handleUpload();
    } else {
      this.appCompilationService.create({
        version: this.validateForm.controls['version'].value,
        description: this.validateForm.controls['description'].value,
        app_id: this.application._id,
        url: this.validateForm.get('url').value
      }, (result) => {
        if (result) {
          this.msg.success('Compilación creada satisfactoriamente');
          this.onCompilationCreated.emit();
        } else {
          this.msg.error('Ocurrió un error al crear la compilación.');
        }
      });
    }
  }

  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => {
          if (w.type !== "application/vnd.android.package-archive") {
            return 0;
          }
          return 1;
        });
        if (filterFiles.length !== fileList.length) {
          this.msg.error(`Por favor selecciona un APK válido`);
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
      version: this.validateForm.controls['version'].value,
      description: this.validateForm.controls['description'].value,
      app_id: this.application._id,
      file_name: this.makeid(12) + ".apk"
    }
    console.log("c", c);
    const headers = new HttpHeaders({
      compilation_data: JSON.stringify(c),
      compilation_name: c.file_name
    });
    const req = new HttpRequest('POST', '/api/upload-package', formData, {
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
              this.msg.success('Compilación creada satisfactoriamente');
              this.validateForm.clearValidators();
              this.onCompilationCreated.emit();
            } else {
              this.uploading = false;
              this.msg.error('Ocurrió un error al crear la compilación.');
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

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
