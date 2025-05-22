import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ScSelectComponent} from '../../../../projects/seacotools/src/lib/sc-select/sc-select.component';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {ScMultiSelectComponent} from '../../../../projects/seacotools/src/lib/sc-multi-select/sc-multi-select.component';
import {ScSearchableSelectComponent} from '../../../../projects/seacotools/src/lib/sc-searchable-select/sc-searchable-select.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ScTextareaComponent} from '../../../../projects/seacotools/src/lib/sc-textarea/sc-textarea.component';
import {ScCheckboxComponent} from '../../../../projects/seacotools/src/lib/sc-checkbox/sc-checkbox.component';

@Component({
  selector: 'app-inputs',
  imports: [ScSelectComponent, ScInputComponent, ScMultiSelectComponent, ScSearchableSelectComponent, ReactiveFormsModule, ScTextareaComponent,
    ScCheckboxComponent],
  templateUrl: './inputs.component.html',

})
export class InputsComponent implements OnInit {

  destroyRef = inject(DestroyRef)
  options = ['Mercedes', 'Audi', 'WW', 'Ford', 'Train'];
  selectOptions = this.options.map((option, index) => ({label: option, value: index + 1}));

  disabledControl = new FormControl({value: null, disabled: true});
  enabledControl = new FormControl(null);

  ngOnInit(): void {
    this.enabledControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
    })
  }
}
