import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [LoginComponent, AuthComponent, RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
