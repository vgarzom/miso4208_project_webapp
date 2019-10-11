import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';
import { Router } from '@angular/router';
import { User } from '../../../../api/models';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import * as md5 from 'md5';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User = {};
  gravatarUrl: String = "";
  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.currentUserService.getCurrentUser((user) => {
      if (user !== null) {
        this.user = user;
        this.gravatarUrl = `//0.gravatar.com/avatar/${md5(this.user.email)}?s=180`;
      } else {
        this.user = {};
      }
    })
  }

  logOut(): void {
    console.log("trying to logout");

    this.modal.confirm({
      nzTitle: 'Ya te vas?',
      nzContent: 'Deseas terminar la sesión?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.currentUserService.clearData((result) => {
            if (result) {
              this.router.navigate(['auth']);
              resolve();
            } else {
              this.message.create("error", "No fue posible cerrar sesión.");
              resolve();
            }
          });
        }).catch(() => console.log('Oops errors!'))
    });
    
  }

}
