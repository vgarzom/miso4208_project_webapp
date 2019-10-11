import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  @Output() onLoginSelected: EventEmitter<void> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.invalid) {
      return;
    }

    if (this.validateForm.controls['password'].value !== this.validateForm.controls['repassword'].value) {
      this.message.create("error", `Las contraseñas no coinciden, por favor verifícalas`);
      return;
    }

    this.http.post(
      "/api/user",
      {
        email: this.validateForm.controls['email'].value,
        password: this.validateForm.controls['password'].value
      }).subscribe(res => {
        if (res['code'] === 200) {
          this.message.create('success', `El usuario fue registrado exitosamente!`);
          this.validateForm.reset();
        } else if (res['code'] === 202) {
          this.message.create('danger', `Parece que ya tenemos registrado tu correo, olvidaste la contraseña?`);
        }
        else {
          this.message.create('danger', `Ocurrió un error al registrar el usuario. ${res['message']}`);
        }
      })


  }



  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repassword: [null, [Validators.required]],
      remember: [true]
    });
  }

  goToLogin(): void {
    this.onLoginSelected.emit();
  }
}
