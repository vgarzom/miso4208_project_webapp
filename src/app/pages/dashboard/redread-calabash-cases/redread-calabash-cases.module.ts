import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedReadCalabashCasesComponent } from './redread-calabash-cases.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RedReadCalabashCasesRoutingModule } from './redread-calabash-cases-routing.module';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [RedReadCalabashCasesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    RedReadCalabashCasesRoutingModule,
    FileUploadModule
  ]
})
export class RedReadCalabashCasesModule { }
