import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload/ng2-file-upload';
import { ApplicationModel, AppCompilationModel } from '../../../../../../api/models';
import { ApplicationsService } from 'src/app/service-clients/applications.service';
import { AppCompilationService } from 'src/app/service-clients/app-compilation.service';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.scss']
})
export class EditApplicationComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: '/api/upload-package', itemAlias: 'file', autoUpload: false });

  appId: string;
  currentApp: ApplicationModel;
  compilations: AppCompilationModel[] = [];
  newCompilation: any = {
    version: '',
    file: null
  }

  uploadProgress: number = 0;
  isUploading: boolean = false;

  //define the constant url we would be uploading to.

  constructor(
    private activatedRoute: ActivatedRoute,
    private appsService: ApplicationsService,
    private appCompilationService: AppCompilationService
  ) {
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      this.newCompilation.file = fileItem;
    }

    this.uploader.onProgressAll = (progress: any) => {
      this.uploadProgress = progress;
    }

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number) => {
      console.log("compilation upload!", response);
      this.isUploading = false;
      //this.videoUploaded = true;
      this.newCompilation = {
        version: '',
        file: null
      }
      this.getCompilations();

    }

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number) => {
      //this.isShowingVideoUploadError = true;
    }

    this.uploader.onWhenAddingFileFailed = () => {
      console.log("Not file allowed");
    }
  }

  ngOnInit() {
    this.appId = this.activatedRoute.snapshot.paramMap.get("appId");

    this.appsService.getByID(this.appId, (result) => {
      this.currentApp = result;
    }, (err) => {
      console.log("Error getting app", err);
    });
    this.getCompilations();
  }

  getCompilations() {
    this.appCompilationService.getByAppId(this.appId, (result) => {
      console.log("compilations result", result);
      this.compilations = result;
    }, (err) => {
      console.log("error looking for versions")
    });
  }

  uploadCompilation() {

    if (this.newCompilation.version === undefined ||
      this.newCompilation.version === '' ||
      this.newCompilation.file === null) {
      return;
    }

    let c = {
      app_id: this.appId,
      file_name: `${this.appId}_${this.newCompilation.version}${this.currentApp.so === 'android' ? '.apk' : '.ipa'}`,
      version: this.newCompilation.version
    }

    var uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'compilation_data', value: JSON.stringify(c) },
    { name: 'compilation_name', value: c.file_name }]
    this.uploader.setOptions(uo);
    this.newCompilation.file.upload();
    this.isUploading = true;
  }
}
