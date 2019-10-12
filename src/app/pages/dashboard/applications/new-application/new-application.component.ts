import { Component, OnInit } from '@angular/core';
import { ApplicationModel, User } from '../../../../../../api/models';
import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/service-clients/current-user.service';
import { ApplicationsService } from 'src/app/service-clients/applications.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss']
})
export class NewApplicationComponent implements OnInit {
  validateForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private currentUserService: CurrentUserService,
    private applicationsService: ApplicationsService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.currentUserService.getCurrentUser((user) => {
      if (user === null) {
        return;
      }
      this.user = user;
      this.initializeApp();
    })
  }

  initializeApp(): void {
    this.validateForm = this.fb.group({
      type: [null, [Validators.required]],
      web: this.fb.group({
        url: [null, []]
      }),
      mobile: this.fb.group({
        so: [null, []]
      }),
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      bundle_id: [null, [Validators.required]]
    });

    // reset the nested choice's email control when switching
    this.validateForm.get('type').valueChanges.subscribe(() => {
      if (this.validateForm.get('type').value === 'web') {
        this.validateForm.get('web').get('url').setValidators([Validators.required]);
        this.validateForm.get('mobile').get('so').setValidators([]);
        this.validateForm.get('mobile').get('so').setValue(null);
      }

      else if (this.validateForm.get('type').value === 'mobile') {
        this.validateForm.get('web').get('url').setValidators([]);
        this.validateForm.get('mobile').get('so').setValidators([Validators.required]);
        this.validateForm.get('web').get('url').setValue(null);
      }
    });
  }

  onCancel(): void {
  }

  createNewApp(): void {


    this.applicationsService.create(
      {
        name: this.validateForm.get('name').value,
        description: this.validateForm.get('description').value,
        bundle_id: this.validateForm.get('bundle_id').value,
        type: this.validateForm.get('type').value,
        so: this.validateForm.get('mobile').get('so').value,
        url: this.validateForm.get('web').get('url').value,
        user_id: this.user._id
      }, (result) => {
        console.log("new app result", result);
        if (result) {
          this.message.create("success", "La aplicación fue creada exitosamente");
          this.initializeApp();
        } else {
          this.message.create("danger", "Ocurrió un error al crear la aplicación. Por favor inténtalo nuevamente.");
        }
      })
  }


  goBackToList(): void {
    this.router.navigate(['/applications']);
  }

  submitForm(): void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (this.validateForm.controls[i] instanceof FormGroup) {
        let selectedF: FormGroup = this.validateForm.controls[i] as FormGroup;
        for (const i in selectedF.controls) {
          selectedF.controls[i].markAsDirty();
          selectedF.controls[i].updateValueAndValidity();
        }
      }
    }

    if (this.validateForm.invalid) {
      return;
    }

    this.createNewApp();

  }

}
