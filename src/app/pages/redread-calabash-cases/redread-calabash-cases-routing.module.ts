import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedReadCalabashCasesComponent } from './redread-calabash-cases.component';

const routes: Routes = [
  { path: '', component: RedReadCalabashCasesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedReadCalabashCasesRoutingModule { }
