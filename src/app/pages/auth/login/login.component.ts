import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  @Output() onRegisterSelected: EventEmitter<void> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private currentUserService: CurrentUserService,
    private router: Router
  ) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) {
      return;
    }

    this.http.post(
      '/api/user/login',
      {
        email: this.validateForm.controls['email'].value, 
        password: this.validateForm.controls['password'].value
      }).subscribe(res => {
        if (res['code'] !== 200) {
          console.log("error autenticando", res);
          this.message.create("error", `Lo sentimos, el usuario o la contraseña son incorrectos`);
        } else {
          console.log("Hola", res);
          this.currentUserService.createCurrentUser(res['user']);
          this.router.navigate(['dashboard']);
        }
      })
  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  goToRegister(): void {
    this.onRegisterSelected.emit();
  }
}
