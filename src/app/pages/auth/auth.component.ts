import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  
  isLogin:boolean = true;
  
  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUserService.getCurrentUser((user) => {
      if (user !== null) {
        this.router.navigate(['dashboard']);
      }
    })
  }

}
