import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RedReadTestListComponent } from './red-read-test-list/red-read-test-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RedReadTestListComponent
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ]
})
export class DashboardModule { }
