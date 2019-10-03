import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/todoist' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'todoist', loadChildren: () => import('./pages/test-list/test-list.module').then(m => m.TestListModule) },
  { path: 'todoist/:id', loadChildren: () => import('./pages/todoistest/todoistest.module').then(m => m.TodoisTestModule) },
  { path: 'redread', loadChildren: () => import('./pages/test-list/test-list.module').then(m => m.TestListModule) },
  { path: 'todoist-cases', loadChildren: () => import('./pages/todoist-cypress-cases/todoist-cypress-cases.module').then(m => m.TodoistCypressCasesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
