import { Component } from '@angular/core';
import {ScSelectComponent} from '../../../../projects/seacotools/src/lib/sc-select/sc-select.component';
import {ScInputComponent} from '../../../../projects/seacotools/src/lib/sc-input/sc-input.component';

@Component({
  selector: 'app-inputs',
  imports: [ScSelectComponent, ScInputComponent],
  templateUrl: './inputs.component.html',

})
export class InputsComponent {
  selectOptions = [
    {label: 'Option 1', value: '1'},
    {label: 'Option 2', value: '2'},
    {label: 'Option 3', value: '3'},
  ]
}
