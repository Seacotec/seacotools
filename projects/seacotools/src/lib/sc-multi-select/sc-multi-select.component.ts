import {ChangeDetectionStrategy, Component, forwardRef, inject, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';
import {createId} from '@paralleldrive/cuid2';

@Component({
  selector: 'sc-multi-select',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './sc-multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScMultiSelectComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ScMultiSelectComponent implements ControlValueAccessor, OnChanges {
  errorMessageService = inject(ScErrorMessageService);
  control = new FormControl<any[]>([]);
  id = createId();

  @Input() options: any[] = [];
  @Input() label: string = '';
  @Input() placeholder: string = 'Select...';
  @Input() groupBy: string = '';
  @Input() searchable: boolean = false;
  @Input() disableClear: boolean = false; // Whether to show the clear option
  @Input() displayKey: string = '';
  @Input() addTag = false;
  @Input() customHeight: 'md' | 'lg' | 'xl' = 'md'; // Default
  @Input() errors: Record<string, any> | null = null;
  @Input() showAllErrors = false;
  @Input() required = false;
  onChange = (value: any) => {};
  onTouch = () => {};

  getLabel(option: any): string {
    if (typeof option === 'string') {
      return option; // For string arrays, simply use the string itself.
    }
    return option[this.displayKey] || ''; // For objects, use the provided key.
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showAllErrors']) {
      this.onElTouch();
    }
  }

  onSelectionChanged(selected: any): void {
    this.onChange(selected); // Propagate the selected value.
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

  errorKeys(errors: Record<string, any> | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    return this.errorMessageService.getErrorMessage(errorKey, errorValue);
  }

  onElTouch() {
    const parent  = document.getElementById(this.id);
    if (parent) {
      const elements = parent.getElementsByClassName('ng-select-container');
      if (elements.length) {
        const element = elements[0] as HTMLElement;
        element.style.borderColor = (this.errors) ? '#fb2c36' : '#f9fafb';
      }
    }
  }
}
