import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';
import { NewApplicationComponent } from './new-application/new-application.component';
//import { NoAppsFoundComponent } from './no-apps-found/no-apps-found.component';
import { AppListComponent } from './app-list/app-list.component';
//import { EditApplicationComponent } from './edit-application/edit-application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    data: {
      title: 'Aplicaciones'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: AppListComponent,
        data: {
          title: "Listado"
        }
      },
      {
        path: 'new',
        component: NewApplicationComponent,
        data: {
          title: "Nueva App"
        }
      }/*,
      {
        path: 'no-apps-found',
        component: NoAppsFoundComponent,
      },
      ,
      {
        path: 'app/:appId',
        component: EditApplicationComponent
      }*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule { }
