import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ScSelectComponent} from '../../../../projects/seacotools/src/lib/sc-select/sc-select.component';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ScFlatpickerComponent} from '../../../../projects/seacotools/src/lib/sc-flatpicker/sc-flatpicker.component';
import {ScCheckboxComponent} from '../../../../projects/seacotools/src/lib/sc-checkbox/sc-checkbox.component';
import {ScTextareaComponent} from '../../../../projects/seacotools/src/lib/sc-textarea/sc-textarea.component';
import {ScMultiSelectComponent} from '../../../../projects/seacotools/src/lib/sc-multi-select/sc-multi-select.component';
import {ScSearchableSelectComponent} from '../../../../projects/seacotools/src/lib/sc-searchable-select/sc-searchable-select.component';
import {ScAirDatePickerComponent} from '../../../../projects/seacotools/src/lib/sc-airdatepicker/sc-air-date-picker.component';


@Component({
  selector: 'app-inputs',
  imports: [ScSelectComponent, ScAirDatePickerComponent, ScInputComponent, ReactiveFormsModule, ScFlatpickerComponent, ScCheckboxComponent, ScTextareaComponent, ScMultiSelectComponent, ScSearchableSelectComponent],
  templateUrl: './inputs.component.html',

})
export class InputsComponent implements OnInit {

  destroyRef = inject(DestroyRef)
  options = ['Mercedes', 'Audi', 'WW', 'Ford', 'Train'];
  selectOptions = this.options.map((option, index) => ({label: option, value: index + 1}));

  enabledControl = new FormControl(null);
  disabledControl = new FormControl({value: null, disabled: true});

  enabledDatePickerControl = new FormControl<string|null>(null);
  disabledDatePickerControl = new FormControl({value: null, disabled: true});

  ngOnInit(): void {
    this.enabledControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
    });
    this.enabledDatePickerControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
    });
  }
}
