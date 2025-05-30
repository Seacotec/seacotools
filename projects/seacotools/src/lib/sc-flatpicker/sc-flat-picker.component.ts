import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, inject, Input, ViewChild,} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import flatpickr from 'flatpickr'; // Flatpickr package
import {CommonModule} from '@angular/common';
import {Instance} from 'flatpickr/dist/types/instance';
import {DateOption, Options} from 'flatpickr/dist/types/options';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import {createId} from '@paralleldrive/cuid2';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';


@Component({
  selector: 'sc-flatpicker',
  templateUrl: './sc-flat-picker.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScFlatPickerComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-instance-id]': 'id',
    '[attr.component-type]': '"flatpicker"'
  }
})
export class ScFlatPickerComponent implements AfterViewInit, ControlValueAccessor {

  id = createId();
  errorMessageService = inject(ScErrorMessageService);

  /** Whether the input is required. */
  @Input() required: boolean = false;

  /** Label for the input field. */
  @Input() label: string = '';

  /** Errors object for validation feedback. */
  @Input() errors: Record<string, boolean> | null = null;

  /** Flatpickr options passed from the user. */
  @Input() options: Partial<Options> = {};

  /**
   * Timezone handling: 'local' or 'utc'.
   * Default: 'local'
   */
  @Input() timezone: 'local' | 'utc' = 'local';

  /** Tracks whether the input field has been touched. */
  touched = false;

  /** Input element reference for Flatpickr. */
  @ViewChild('myDatepicker') myDatepicker!: ElementRef<HTMLInputElement>;

  /** Flatpickr instance for the date picker. */
  private datePicker?: Instance;

  /** Input ID and error message ID for accessibility. */
  readonly myDatepickerId = `date-picker-${Math.random().toString(36).substr(2, 9)}`;
  readonly errorId = `${this.myDatepickerId}-error`;

  /** Callback for when the value changes. */
  private onChange: (value: string | null) => void = () => {};

  /** Callback for when the input field is touched. */
  protected onTouch: () => void = () => {};

  /** Whether the input element is disabled. */
  private disabled = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const plugins = [];
    // Add Plugin for "Time Confirmation" if time is enabled
    if (this.options?.enableTime) {
      plugins.push(
        confirmDatePlugin({
          confirmText: 'OKAY',
          showAlways: true,
          confirmIcon: '',
        })
      );
    }

    // Handle timezone-specific options
    const formattedOptions: Partial<Options> = {
      ...this.options, // Keep user-provided options
      allowInput: true,
      dateFormat: this.options?.enableTime ? 'Y-m-d H:i' : 'Y-m-d',
      minDate: this.getResolvedDate(this.options?.minDate), // Convert minDate to string
      maxDate: this.getResolvedDate(this.options?.maxDate), // Convert maxDate to string
      defaultDate: this.getResolvedDate(this.options?.defaultDate), // Convert defaultDate to string
      time_24hr: true,
      plugins: plugins,
      onChange: (value: Date[]) => {
        if (value && value.length) {
          let selectedDate = value[0];
          if (this.timezone === 'utc') {
            const offset = selectedDate.getTimezoneOffset() * 60 * 1000; // offset in milliseconds
            selectedDate = new Date(selectedDate.getTime() - offset);
          }
          // Emitting value as ISO string for utc or localized string for local
          this.onChange(selectedDate.toISOString());
        } else {
          this.onChange(null);
        }
      },
    };
    // Initialize Flatpickr
    this.datePicker = flatpickr(this.myDatepicker.nativeElement, formattedOptions);

    // Handle disabled state
    if (this.disabled && this.datePicker) {
      this.datePicker._input.disabled = true;
      this.cdr.detectChanges();
    }
  }

  /**
   * Resolves the `defaultDate` option based on the timezone.
   */
  private getResolvedDate(date: DateOption | DateOption[] | undefined): Date | undefined {
    const dateString = this.overrideDate(date);
    if (!dateString) return undefined;
    return this.handleTimeZone(dateString);
  }


  /**
   * Handles incoming date strings for setting the Flatpickr date.
   * Respects the configured timezone (UTC or local).
   */
  writeValue(dateString: string | null): void {
    if (!dateString) {
      this.datePicker?.clear();
      return;
    }
    let date = this.handleTimeZone(dateString);
    if (date) this.datePicker?.setDate(date);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.datePicker) {
      this.datePicker._input.disabled = isDisabled;
      this.cdr.detectChanges();
    }
  }

  /**
   * Utility to extract keys from an object.
   */
  objectKeys(obj: Record<string, any> | null): string[] {
    return obj ? Object.keys(obj) : [];
  }

  private handleTimeZone(dateString: string) {
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return undefined;
    }
    if (this.timezone === 'utc') {
      // Subtract UTC offset to align the default date with UTC
      const offset = date.getTimezoneOffset() * 60 * 1000; // offset in milliseconds
      return new Date(date.getTime() + offset);
    }
    return date;
  }

  /**
   * Ensures the defaultDate passed to Flatpickr is converted to a string.
   */
  private overrideDate(defaultDate: any): string | undefined {
    if (!defaultDate) {
      return undefined;
    }

    if (typeof defaultDate === 'string') {
      // Ensure it's already a string
      return defaultDate;
    }

    if (defaultDate instanceof Date && !isNaN(defaultDate.getTime())) {
      // Convert Date object to ISO string
      return defaultDate.toISOString();
    }

    console.error('Invalid defaultDate provided:', defaultDate);
    return undefined;
  }

  errorKeys(errors: Record<string, any> | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    return this.errorMessageService.getErrorMessage(errorKey, errorValue);
  }

}
