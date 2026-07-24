import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ScSelectComponent} from '../../../../projects/seacotools/src/lib/sc-select/sc-select.component';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ScFlatPickerComponent} from '../../../../projects/seacotools/src/lib/sc-flatpicker/sc-flat-picker.component';
import {ScCheckboxComponent} from '../../../../projects/seacotools/src/lib/sc-checkbox/sc-checkbox.component';
import {ScTextareaComponent} from '../../../../projects/seacotools/src/lib/sc-textarea/sc-textarea.component';
import {ScMultiSelectComponent} from '../../../../projects/seacotools/src/lib/sc-multi-select/sc-multi-select.component';
import {ScSearchableSelectComponent} from '../../../../projects/seacotools/src/lib/sc-searchable-select/sc-searchable-select.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  ScFlatPickerSplittedComponent
} from '../../../../projects/seacotools/src/lib/sc-flatpicker-splitted/sc-flat-picker-splitted.component';
import {
  ScTimePickerComponent
} from '../../../../projects/seacotools/src/lib/sc-time-picker/sc-time-picker.component';


@Component({
  selector: 'app-inputs',
  imports: [ScSelectComponent, ScInputComponent, ReactiveFormsModule, ScFlatPickerComponent, ScFlatPickerSplittedComponent, ScCheckboxComponent, ScTextareaComponent, ScMultiSelectComponent, ScSearchableSelectComponent, ScFlatPickerComponent, ScTimePickerComponent],
  templateUrl: './inputs.component.html',

})
export class InputsComponent implements OnInit {

  destroyRef = inject(DestroyRef)
  options = ['Mercedes', 'Audi', 'WW', 'Ford', 'Train'];
  selectOptions = this.options.map((option, index) => ({label: option, value: index + 1}));

  private fb = inject(FormBuilder);

  enabledFormArray = this.fb.array([]);
  disabledFormArray = this.fb.array([]);
  minDate = '2025-06-02T08:00:00Z'
  maxDate = '2025-06-20T10:00:00Z'

  // In ngOnInit:
  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      this.disabledFormArray.push(this.fb.control({value: null, disabled: true}, Validators.required));
      this.enabledFormArray.push(this.fb.control(null, Validators.required));
    }
    this.enabledFormArray.at(10).valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
    });
    this.enabledFormArray.at(3).setValue(new Date().toISOString());
    // sc-time-picker demos: plain "HH:mm" value and an ISO datetime round-trip
    this.enabledFormArray.at(14).setValue('09:30');
    this.enabledFormArray.at(16).setValue('2025-06-02T13:45:00Z');
    this.enabledFormArray.at(16).valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log('sc-time-picker (ISO):', value);
    });
    this.enabledFormArray.at(3).valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
    })
    setTimeout(() => {
      this.options = [...this.options, 'BMW']
      this.selectOptions = [...this.selectOptions, {label: 'BMV', value: 6} ]
      this.maxDate = '2025-06-28T10:00:00Z'
    }, 3000)
  }
}
