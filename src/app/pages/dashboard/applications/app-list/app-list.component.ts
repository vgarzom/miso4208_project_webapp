import { Component, OnInit } from '@angular/core';
import { ApplicationModel, User } from '../../../../../../api/models';
import { Router } from '@angular/router';
import { ApplicationsService } from 'src/app/service-clients/applications.service';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit {

  isLoading: boolean = true;
  user: User = {};
  applications: ApplicationModel[] = [];
  constructor(private applicationsService: ApplicationsService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.currentUserService.getCurrentUser((user) => {
      if (user === null) {
        this.router.navigate(['/']);
        return;
      }
      console.log("user", user);
      this.user = user;
      this.applicationsService.getByUserID(user._id,
        (apps) => {
          this.isLoading = false;
          console.log("apps", apps);
          this.applications = apps;
          if (this.applications.length === 0) {
            //this.router.navigate(['applications/no-apps-found']);
          }
        },
        (err) => {
          this.isLoading = false;
          console.log("error", err);
        });
    })
  }

  createNewApp(): void {
    this.router.navigate(['/dashboard/apps/new']);
  }

  onApplicationSelected(app: ApplicationModel): void {
    console.log("Application selected", app);
    this.router.navigate([`applications/app/${app._id}`]);
  }

}
