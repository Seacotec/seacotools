import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  Input,
  OnChanges,
  OnDestroy, signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import flatpickr from 'flatpickr';
import {CommonModule} from '@angular/common';
import {Instance} from 'flatpickr/dist/types/instance';
import {DateOption, Options} from 'flatpickr/dist/types/options';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';


@Component({
  selector: 'sc-flatpicker-splitted',
  templateUrl: './sc-flat-picker-splitted.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScFlatPickerSplittedComponent),
      multi: true,
    },
  ],
})
export class ScFlatPickerSplittedComponent implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy{

  errorMessageService = inject(ScErrorMessageService);

  /** Whether the input is required. */
  @Input() required: boolean = false;

  /** Label for the input field. */
  @Input() label: string = '';

  /** Errors object for validation feedback. */
  errors = input<Record<string, boolean> | null>(null);

  /** Flatpickr options passed from the user. */
  @Input() options: Partial<Options> = {};
  @Input() minDate = '';
  @Input() maxDate = '';
  borderColorClass = input('border-gray-400 dark:border-gray-700');
  bgColorClass = input('bg-gray-50 dark:bg-gray-700');

  /**
   * Timezone handling: 'local' or 'utc'.
   * Default: 'local'
   */
  @Input() timezone: 'local' | 'utc' = 'local';
  @Input() showAllErrors = false;

  /** Tracks whether the input field has been touched. */
  touched = signal(false);

  /** Whether to split date and time into two inputs. */
  @Input() splitDateTime = true;

  /** Input element reference for Flatpickr. */
  @ViewChild('myDatepicker') myDatepicker!: ElementRef<HTMLInputElement>;
  @ViewChild('myTimepicker') myTimepicker?: ElementRef<HTMLInputElement>;

  /** Flatpickr instance for the date picker. */
  private datePicker?: Instance;
  private timePicker?: Instance;

  private selectedDatePart?: Date;
  private selectedTimePart?: Date;

  /** Callback for when the value changes. */
  private onChange: (value: string | null) => void = () => {};

  /** Callback for when the input field is touched. */
  protected onTouch: () => void = () => {};

  /** Placeholder text for the input field. */
  @Input() placeholder: string = '';

  /** Whether the input element is disabled. */
  private disabled = false;
  private date?: Date;

  computedClasses = computed(() => {
    const borderColorClass = this.borderColorClass();
    const bgColorClass = this.bgColorClass();
    const defaultClasses = 'outline-none text-sm disabled:text-gray-600 disabled:bg-gray-300 dark:placeholder:text-gray-300 ' +
      'dark:disabled:bg-gray-500 dark:text-gray-100 dark:disabled:text-gray-300 w-full px-3 border rounded-lg ' +
      'focus:border-indigo-500 h-9 placeholder-gray-500 placeholder-opacity-70';
    if (this.errors() && this.touched()) {
      return defaultClasses + ' border-red-500 ' + bgColorClass;
    } else {
      return `${defaultClasses} ${borderColorClass} ${bgColorClass}`;
    }
  });

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.datePicker) {
      if (changes['minDate'] && changes['minDate'].currentValue !== undefined) {
        const resolvedMinDate = this.getResolvedDate(this.minDate);
        this.datePicker.set('minDate', resolvedMinDate);
      }

      if (changes['maxDate'] && changes['maxDate'].currentValue !== undefined) {
        const resolvedMaxDate = this.getResolvedDate(this.maxDate);
        this.datePicker.set('maxDate', resolvedMaxDate);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.splitDateTime) {
      this.initSplitPickers();
    } else {
      this.initSinglePicker();
    }

    if (this.disabled) {
      this.datePicker?._input && (this.datePicker._input.disabled = true);
      this.timePicker?._input && (this.timePicker._input.disabled = true);
      this.cdr.detectChanges();
    }
  }

  private initSinglePicker(): void {
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
      minDate: this.getResolvedDate(this.minDate), // Convert minDate to string
      maxDate: this.getResolvedDate(this.maxDate), // Convert maxDate to string
      defaultDate: this.date,
      time_24hr: true,
      plugins: plugins,
      onChange: (value: Date[]) => {
        if (value && value.length) {
          let selectedDate = value[0];
          this.onChange(this.normalizeForOutput(selectedDate).toISOString());
        } else {
          this.onChange(null);
        }
      },
    };
    // Initialize Flatpickr
    this.datePicker = flatpickr(this.myDatepicker.nativeElement, formattedOptions);
  }

  private initSplitPickers(): void {
    const dateOptions: Partial<Options> = {
      ...this.options,
      enableTime: false,
      allowInput: true,
      dateFormat: 'Y-m-d',
      minDate: this.getResolvedDate(this.minDate),
      maxDate: this.getResolvedDate(this.maxDate),
      defaultDate: this.date,
      onChange: (value: Date[]) => {
        if (value && value.length) {
          this.selectedDatePart = value[0];
          this.emitSplitValue();
        } else {
          this.selectedDatePart = undefined;
          this.onChange(null);
        }
      },
    };

    const timeOptions: Partial<Options> = {
      enableTime: true,
      noCalendar: true,
      allowInput: true,
      dateFormat: 'H:i',
      time_24hr: true,
      plugins: [
        confirmDatePlugin({
          confirmText: 'OKAY',
          showAlways: true,
          confirmIcon: '',
        }),
      ],
      onChange: (value: Date[]) => {
        if (value && value.length) {
          this.selectedTimePart = value[0];
          this.emitSplitValue();
        } else {
          this.selectedTimePart = undefined;
          this.emitSplitValue();
        }
      },
    };

    this.datePicker = flatpickr(this.myDatepicker.nativeElement, dateOptions);
    if (this.myTimepicker?.nativeElement) {
      this.timePicker = flatpickr(this.myTimepicker.nativeElement, timeOptions);
    }
  }

  private emitSplitValue(): void {
    if (!this.selectedDatePart) {
      this.onChange(null);
      return;
    }

    const date = new Date(this.selectedDatePart);
    if (this.selectedTimePart) {
      date.setHours(this.selectedTimePart.getHours(), this.selectedTimePart.getMinutes(), 0, 0);
    } else {
      date.setHours(0, 0, 0, 0);
    }

    this.onChange(this.normalizeForOutput(date).toISOString());
  }

  private normalizeForOutput(date: Date): Date {
    if (this.timezone === 'utc') {
      const offset = date.getTimezoneOffset() * 60 * 1000;
      return new Date(date.getTime() - offset);
    }
    return date;
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
      this.timePicker?.clear();
      return;
    }
    const date = this.handleTimeZone(dateString);
    if (date) {
      if (this.splitDateTime) {
        this.selectedDatePart = date;
        this.selectedTimePart = date;
        this.datePicker ? this.datePicker.setDate(date, false) : this.date = date;
        this.timePicker && this.timePicker.setDate(date, false);
      } else {
        this.datePicker ? this.datePicker.setDate(date) : this.date = date;
      }
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = () => {
      this.touched.set(true);
      this.cdr.detectChanges(); // Trigger change detection
      fn();
    };
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.datePicker) {
      this.datePicker._input.disabled = isDisabled;
    }
    if (this.timePicker) {
      this.timePicker._input.disabled = isDisabled;
    }
    this.cdr.detectChanges();
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

  ngOnDestroy(): void {
    if (this.datePicker) {
      this.datePicker.destroy();
    }
    if (this.timePicker) {
      this.timePicker.destroy();
    }
  }

  onDateKeydown(event: KeyboardEvent): void {
    this.handlePickerKeydown(event, this.datePicker);
  }

  onTimeKeydown(event: KeyboardEvent): void {
    this.handlePickerKeydown(event, this.timePicker);
  }

  private handlePickerKeydown(event: KeyboardEvent, picker?: Instance): void {
    if (!picker || this.disabled) return;

    const openKeys = ['Enter', ' ', 'ArrowDown'];
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      picker.open();
      return;
    }

    if (openKeys.includes(event.key)) {
      if (!picker.isOpen) {
        event.preventDefault();
        picker.open();
      }
      return;
    }

    if (event.key === 'Escape' && picker.isOpen) {
      event.preventDefault();
      picker.close();
    }
  }

}
