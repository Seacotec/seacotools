import {ChangeDetectorRef, Component, DestroyRef, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogRef} from '@ngneat/dialog';
import {ScHelperService} from '../../../../projects/seacotools/src/lib/sc-services/sc-helper.service';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {ScButtonComponent} from '../../../../projects/seacotools/src/lib/sc-button/sc-button.component';

@Component({
  selector: 'app-sample-dialog',
  imports: [
    ReactiveFormsModule,
    ScInputComponent,
    ScButtonComponent
  ],
  templateUrl: './sample-dialog.component.html',
})
export class SampleDialogComponent {

  private fb = inject(NonNullableFormBuilder);
  private ref: DialogRef<{  }> = inject(DialogRef);
  private helperService = inject(ScHelperService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  showAllErrors = false;


  form = this.fb.group({
    name: this.fb.control(null, [Validators.required]),
    email: this.fb.control(null, [Validators.email, Validators.required]),
    phone: this.fb.control(null, []),
    address: this.fb.control(null, [Validators.maxLength(255)]),
  });


  onSubmit() {
    if (this.form.invalid){
      this.showAllErrors = true;
      return;
    }
    const rawValue = this.form.getRawValue();
    console.log(rawValue);
  }

  cancel() {
    this.ref.close();
  }
}
