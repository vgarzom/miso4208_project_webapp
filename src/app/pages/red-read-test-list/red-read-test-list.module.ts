import { NgModule } from '@angular/core';
import { RedReadTestListComponent } from './red-read-test-list.component';
import { RedReadTestListRoutingModule } from './red-read-test-list-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';

@NgModule({
  declarations: [RedReadTestListComponent],
  imports: [
    CommonModule,
    RedReadTestListRoutingModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [
    RedReadTestListComponent
  ]
})
export class RedReadTestListModule { }
