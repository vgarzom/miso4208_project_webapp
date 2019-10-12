import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ApplicationModel } from '../../../../../../api/models';
import { ApplicationsService } from 'src/app/service-clients/applications.service';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.scss']
})
export class EditApplicationComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: '/api/upload-package', itemAlias: 'file', autoUpload: false });

  appId: string;
  currentApp: ApplicationModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appsService: ApplicationsService
  ) {
  }

  ngOnInit() {
    this.appId = this.activatedRoute.snapshot.paramMap.get("appId");

    this.appsService.getByID(this.appId, (result) => {
      this.currentApp = result;
    }, (err) => {
      console.log("Error getting app", err);
    });
  }

}
