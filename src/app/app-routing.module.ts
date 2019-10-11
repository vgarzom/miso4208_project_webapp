import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  /*{ path: 'todoist', loadChildren: () => import('./pages/test-list/test-list.module').then(m => m.TestListModule) },
  { path: 'todoist/:id', loadChildren: () => import('./pages/todoistest/todoistest.module').then(m => m.TodoisTestModule) },
  { path: 'redread', loadChildren: () => import('./pages/red-read-test-list/red-read-test-list.module').then(m => m.RedReadTestListModule) },
  { path: 'todoist-cases', loadChildren: () => import('./pages/todoist-cypress-cases/todoist-cypress-cases.module').then(m => m.TodoistCypressCasesModule) },
  { path: 'redread-cases', loadChildren: () => import('./pages/redread-calabash-cases/redread-calabash-cases.module').then(m => m.RedReadCalabashCasesModule) }
  */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
