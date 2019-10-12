import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedReadTestListComponent } from './red-read-test-list/red-read-test-list.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { title: 'dashboard' },
    children: [
      { path: '', redirectTo: 'redread-tests' },
      { path: 'redread-tests', component: RedReadTestListComponent, data: { title: "redread" } },
      { path: 'apps', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
