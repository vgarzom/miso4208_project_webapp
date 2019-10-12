import { Component, OnInit, Input } from '@angular/core';
import { ApplicationModel, AppCompilationModel } from '../../../../../../api/models';
import { ApplicationsService } from 'src/app/service-clients/applications.service';
import { AppCompilationService } from 'src/app/service-clients/app-compilation.service';

@Component({
  selector: 'app-compilations-list',
  templateUrl: './compilations-list.component.html',
  styleUrls: ['./compilations-list.component.scss']
})
export class CompilationsListComponent implements OnInit {
  private _application: ApplicationModel;
  @Input()
  set application(value: ApplicationModel) {
    this._application = value;
    this.getCompilations();
  }

  get application(): ApplicationModel {
    return this._application;
  }

  compilations: AppCompilationModel[] = [];

  constructor(
    private appCompilationService: AppCompilationService
  ) { }

  ngOnInit() {
  }

  getCompilations() {
    this.appCompilationService.getByAppId(this.application._id, (result) => {
      this.compilations = result;
    }, (err) => {
      console.log("error looking for versions")
    });
  }

}
