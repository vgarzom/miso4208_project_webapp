import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadFile, NzMessageService, UploadFilter } from 'ng-zorro-antd';
import { HttpRequest, HttpClient, HttpHeaders, HttpEventType, HttpHeaderResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Observer } from 'rxjs';
import { CalabashFeatureModel } from '../../../../api/models/calabash-feature.model';
import { RedReadCalabashCaseService } from 'src/app/service-clients/redread-calabash-case.service';

@Component({
  selector: 'app-redread-calabash-cases',
  templateUrl: './redread-calabash-cases.component.html',
  styleUrls: ['./redread-calabash-cases.component.scss']
})
export class RedReadCalabashCasesComponent implements OnInit {
  loadingStatus: string = "new-case";
  validateForm: FormGroup;
  fileList: UploadFile[] = [];
  uploading: boolean = false;
  uploadPercentage: number = 0;
  cases: CalabashFeatureModel[] = [];

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private RedReadCalabashCaseService: RedReadCalabashCaseService
    ) {

  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });

    this.updateList();
  }


  updateList(): void {
    
    this.RedReadCalabashCaseService.getAll(
      res => {
        this.cases = res;
      },
      err => {
        console.log("error consultando");
      });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.handleUpload();
    }
  }

  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => {
          
          let names = w.name.split(".");
          if (names.length < 2) {
            return 0;
          }
          if (`${names[names.length - 1]}` !== 'feature') {
            return 0
          }
          return 1;
        });
        if (filterFiles.length !== fileList.length) {
          this.msg.error(`Por favor selecciona un archivo con extensión .feature`);
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
      file_name: this.makeid(12) + ".feature"
    }
    console.log("c", c);
    const headers = new HttpHeaders({
      calabash_feature_data: JSON.stringify(c),
      calabash_feature_name: c.file_name
    });
    const req = new HttpRequest('POST', '/api/calabash-case', formData, {
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
              setTimeout(() => {
                this.updateList();
              }, 500);
            } else {
              this.uploading = false;
              this.msg.error('Ocurrió un error al crear el caso de pruebas.');
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
