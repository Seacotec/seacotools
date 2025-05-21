import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'sc-searchable-select',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './sc-searchable-select.component.html',
  styleUrl: './sc-searchable-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScSearchableSelectComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScSearchableSelectComponent implements ControlValueAccessor {
  control = new FormControl<any>(null);

  @Input() options: any[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = 'Search...';
  @Input() searchable: boolean = true; // Auto filter toggle
  @Input() displayKey: string = '';
  @Input() addTag = false;

  onChange = (value: any) => {};
  onTouch = () => {};

  getLabel(option: any): string {
    if (typeof option === 'string') {
      return option; // For string arrays, simply use the string itself.
    }
    return option[this.displayKey] || ''; // For objects, use the provided key.
  }

  onSelectionChanged(selected: any): void {
    this.onChange(selected); // Propagate the selected value.
    console.log(selected)
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) this.control.disable();
    else this.control.enable();
  }
}
