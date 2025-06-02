import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ScSelectComponent} from '../../../../projects/seacotools/src/lib/sc-select/sc-select.component';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';
import {ScFlatPickerComponent} from '../../../../projects/seacotools/src/lib/sc-flatpicker/sc-flat-picker.component';
import {ScCheckboxComponent} from '../../../../projects/seacotools/src/lib/sc-checkbox/sc-checkbox.component';
import {ScTextareaComponent} from '../../../../projects/seacotools/src/lib/sc-textarea/sc-textarea.component';
import {ScMultiSelectComponent} from '../../../../projects/seacotools/src/lib/sc-multi-select/sc-multi-select.component';
import {ScSearchableSelectComponent} from '../../../../projects/seacotools/src/lib/sc-searchable-select/sc-searchable-select.component';
import { FormBuilder } from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-inputs',
  imports: [ScSelectComponent, ScInputComponent, ReactiveFormsModule, ScFlatPickerComponent, ScCheckboxComponent, ScTextareaComponent, ScMultiSelectComponent, ScSearchableSelectComponent],
  templateUrl: './inputs.component.html',

})
export class InputsComponent implements OnInit {

  destroyRef = inject(DestroyRef)
  options = ['Mercedes', 'Audi', 'WW', 'Ford', 'Train'];
  selectOptions = this.options.map((option, index) => ({label: option, value: index + 1}));

  private fb = inject(FormBuilder);

  enabledFormArray = this.fb.array([]);
  disabledFormArray = this.fb.array([]);

  // In ngOnInit:
  ngOnInit(): void {
    for (let i = 0; i < 20; i++) {
      this.disabledFormArray.push(this.fb.control({value: null, disabled: true}));
      this.enabledFormArray.push(this.fb.control(null));
    }
    this.enabledFormArray.at(6).valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
    })
  }
}
