import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoistCypressCasesComponent } from './todoist-cypress-cases.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TodoistCypressCasesRoutingModule } from './todoist-cypress-cases-routing.module';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [TodoistCypressCasesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    TodoistCypressCasesRoutingModule,
    FileUploadModule
  ]
})
export class TodoistCypressCasesModule { }
