import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoistestComponent } from './todoistest.component';

const routes: Routes = [
  { path: '', component: TodoistestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoisTestRoutingModule { }
