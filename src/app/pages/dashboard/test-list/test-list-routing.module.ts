import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestListComponent } from './test-list.component';

const routes: Routes = [
  { path: '', component: TestListComponent, data: {title: "Pruebas Todois"} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestListRoutingModule { }
