import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidators} from '../../../../projects/seacotools/src/lib/validators/custom-validators';


@Component({
  selector: 'app-inputs',
  imports: [ScInputComponent, ReactiveFormsModule],
  templateUrl: './validation.component.html',

})
export class ValidationComponent implements OnInit {

  destroyRef = inject(DestroyRef)
  options = ['Mercedes', 'Audi', 'WW', 'Ford', 'Train'];

  formGroup = new FormGroup({
    passwordControl : new FormControl(null, [Validators.required, CustomValidators.password({
      minLength: 8,
      requireSpecialChar: false,
    })]),
    confirmPasswordControl : new FormControl(null, [Validators.required]),
  }, {
    validators: CustomValidators.passwordMatch('passwordControl', 'confirmPasswordControl')
  })

  numericControl = new FormControl(null, [Validators.required, CustomValidators.numeric(1)]);
  emailControl = new FormControl(null, [Validators.required, Validators.email]);


  ngOnInit(): void {
  }
}
