import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { TodoistestComponent } from './todoistest.component';
import { TodoisTestRoutingModule } from './todoistest-routing.module';

@NgModule({
  declarations: [TodoistestComponent],
  imports: [
    CommonModule,
    FormsModule,
    TodoisTestRoutingModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [
    TodoistestComponent
  ]
})
export class TodoisTestModule { }
