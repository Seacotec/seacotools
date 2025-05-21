import { Component } from '@angular/core';
import {ScSelectComponent} from '../../../../projects/seacotools/src/lib/sc-select/sc-select.component';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';
import {ScMultiSelectComponent} from '../../../../projects/seacotools/src/lib/sc-multi-select/sc-multi-select.component';
import {ScSearchableSelectComponent} from '../../../../projects/seacotools/src/lib/sc-searchable-select/sc-searchable-select.component';

@Component({
  selector: 'app-inputs',
  imports: [ScSelectComponent, ScInputComponent, ScMultiSelectComponent, ScSearchableSelectComponent],
  templateUrl: './inputs.component.html',

})
export class InputsComponent {
  options = ['Mercedes', 'Audi', 'WW', 'Ford', 'Train'];
  selectOptions = this.options.map((option, index) => ({label: option, value: index + 1}));
}
