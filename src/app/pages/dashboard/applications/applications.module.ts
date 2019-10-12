import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ApplicationsComponent } from './applications.component';
import { ApplicationsRoutingModule } from './applications-routing.module';
import { AppListComponent } from './app-list/app-list.component';
import { NewApplicationComponent } from './new-application/new-application.component';
//import { NoAppsFoundComponent } from './no-apps-found/no-apps-found.component';
//import { EditApplicationComponent } from './edit-application/edit-application.component';
// Modal Component
import { FileUploadModule } from 'ng2-file-upload';
import { NgxFilesizeModule } from 'ngx-filesize';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';
import { ApplicationsService } from 'src/app/service-clients/applications.service';
import { AppCompilationService } from 'src/app/service-clients/app-compilation.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { UploadCompilationComponent } from './upload-compilation/upload-compilation.component';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ApplicationsRoutingModule,
    FileUploadModule,
    NgxFilesizeModule,
    NgZorroAntdModule
  ],
  declarations: [
    ApplicationsComponent, 
    AppListComponent, 
    NewApplicationComponent,
    EditApplicationComponent,
    UploadCompilationComponent
  ],
  providers: [
    CurrentUserService,
    ApplicationsService,
    AppCompilationService
  ],
})
export class ApplicationsModule { }
