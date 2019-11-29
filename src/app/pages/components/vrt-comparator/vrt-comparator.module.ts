import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VrtComparatorComponent } from './vrt-comparator.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TestObjectService } from 'src/app/service-clients/test-object.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [VrtComparatorComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [VrtComparatorComponent],
  providers: [TestObjectService]
})
export class VrtComparatorModule { }
