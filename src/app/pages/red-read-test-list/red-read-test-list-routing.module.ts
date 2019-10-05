import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedReadTestListComponent } from './red-read-test-list.component';

const routes: Routes = [
  { path: '', component: RedReadTestListComponent, data: {title: "Pruebas RedRead"} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedReadTestListRoutingModule { }
