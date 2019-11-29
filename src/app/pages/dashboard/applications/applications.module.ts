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
import { CompilationsListComponent } from './compilations-list/compilations-list.component';
import { TestcasesListComponent } from './testcases-list/testcases-list.component';
import { UploadTestCaseComponent } from './upload-test-case/upload-test-case.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TestsListComponent } from './tests-list/tests-list.component';
import { TestResquesterComponent } from './test-resquester/test-resquester.component';
import { TodoistestComponent } from '../todoistest/todoistest.component';
import { CalabashTestComponent } from './calabash-test/calabash-test.component';
import { VrtComparatorModule } from '../../components/vrt-comparator/vrt-comparator.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ApplicationsRoutingModule,
    FileUploadModule,
    NgxFilesizeModule,
    NgZorroAntdModule,
    CKEditorModule,
    VrtComparatorModule
  ],
  declarations: [
    ApplicationsComponent, 
    AppListComponent, 
    NewApplicationComponent,
    EditApplicationComponent,
    UploadCompilationComponent,
    CompilationsListComponent,
    TestcasesListComponent,
    UploadTestCaseComponent,
    TestsListComponent,
    TestResquesterComponent,
    TodoistestComponent,
    CalabashTestComponent
  ],
  providers: [
    CurrentUserService,
    ApplicationsService,
    AppCompilationService
  ],
})
export class ApplicationsModule { }
