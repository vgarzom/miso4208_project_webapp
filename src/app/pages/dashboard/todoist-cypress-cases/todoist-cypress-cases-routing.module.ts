import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoistCypressCasesComponent } from './todoist-cypress-cases.component';

const routes: Routes = [
  { path: '', component: TodoistCypressCasesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoistCypressCasesRoutingModule { }
