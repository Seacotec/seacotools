// import {
//   AfterViewInit,
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   Component,
//   ElementRef,
//   forwardRef,
//   Input,
//   ViewChild,
// } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
// import AirDatepicker, {AirDatepickerDate, AirDatepickerOptions} from 'air-datepicker'; // Import air-datepicker
// import {CommonModule} from '@angular/common';
// import {createId} from '@paralleldrive/cuid2';
//
// @Component({
//   selector: 'sc-air-datepicker',
//   templateUrl: './sc-air-date-picker.component.html',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => ScAirDatePickerComponent),
//       multi: true,
//     },
//   ],
// })
// export class ScAirDatePickerComponent implements AfterViewInit, ControlValueAccessor {
//   /** Whether the input is required. */
//   @Input() required: boolean = false;
//
//   /** Label for the input field. */
//   @Input() label: string = '';
//
//   /** Errors object for validation feedback. */
//   @Input() errors: Record<string, boolean> | null = null;
//
//   /** AirDatepicker options passed from the user. */
//   @Input() options: Partial<AirDatepickerOptions> = {}; // Note: The AirDatepicker has its own type for options.
//
//   /**
//    * Timezone handling: 'local' or 'utc'.
//    * Default: 'local'
//    */
//   @Input() timezone: 'local' | 'utc' = 'local';
//
//   /** Tracks whether the input field has been touched. */
//   touched = false;
//
//   /** Input element reference for AirDatepicker. */
//   @ViewChild('myDatepicker') myDatepicker!: ElementRef<HTMLInputElement>;
//
//   /** AirDatepicker instance for the date picker. */
//   private datePicker?: any;
//
//   /** Input ID and error message ID for accessibility. */
//   readonly myDatepickerId = `date-picker-${Math.random().toString(36).substr(2, 9)}`;
//   readonly errorId = `${this.myDatepickerId}-error`;
//
//   /** Callback for when the value changes. */
//   private onChange: (value: string | null) => void = () => {};
//
//   /** Callback for when the input field is touched. */
//   protected onTouch: () => void = () => {};
//
//   /** Whether the input element is disabled. */
//   private disabled = false;
//
//   constructor(private cdr: ChangeDetectorRef) {}
//
//   ngAfterViewInit(): void {
//     // Handle timezone-specific options
//     const selectedDate = this.getAirDatePickerDate(this.options?.selectedDates);
//     const resolvedOptions: Partial<AirDatepickerOptions> = {
//       ...this.options,
//       dateFormat: 'yyyy-MM-dd',
//       minDate: this.getAirDatePickerDate(this.options?.minDate),
//       maxDate: this.getAirDatePickerDate(this.options?.maxDate),
//       selectedDates: selectedDate ? [selectedDate] : undefined,
//       onSelect: ({date}) => {
//         if (date) {
//           let selectedDate = Array.isArray(date) ? date[0] : date;
//           if (this.timezone === 'utc') {
//             const offset = selectedDate.getTimezoneOffset() * 60 * 1000; // offset in milliseconds
//             selectedDate = new Date(selectedDate.getTime() - offset);
//           }
//           this.onChange(selectedDate.toISOString());
//         } else {
//           this.onChange(null);
//         }
//       },
//     };
//
//     // Initialize Airdatepicker
//     this.datePicker = new AirDatepicker(this.myDatepicker.nativeElement, resolvedOptions);
//
//     // Handle disabled state
//     if (this.disabled) {
//       this.myDatepicker.nativeElement.disabled = true;
//       this.cdr.detectChanges();
//     }
//   }
//
//   /**
//    * Resolves the `selectedDates`, `minDate`, or `maxDate` based on the timezone.
//    */
//   private getAirDatePickerDate(date: boolean | AirDatepickerDate | AirDatepickerDate[] | undefined): string | undefined {
//     if (!date || typeof date === 'boolean') return undefined;
//     const dateString = this.overrideDate(date);
//     if (!dateString) return undefined;
//     return this.handleTimeZone(dateString) || undefined;
//   }
//
//   /**
//    * Handles incoming value for the AirDatepicker input.
//    */
//   writeValue(dateString: string | null): void {
//     if (!this.datePicker) return;
//
//     if (!dateString) {
//       this.datePicker.clear();
//       return;
//     }
//
//     let date = this.handleTimeZone(dateString);
//     this.datePicker.selectDate(date);
//   }
//
//   registerOnChange(fn: (value: string | null) => void): void {
//     this.onChange = fn;
//   }
//
//   registerOnTouched(fn: () => void): void {
//     this.onTouch = fn;
//   }
//
//   setDisabledState(isDisabled: boolean): void {
//     this.disabled = isDisabled;
//     if (this.datePicker) {
//       this.myDatepicker.nativeElement.disabled = isDisabled;
//       this.cdr.detectChanges();
//     }
//   }
//
//   private handleTimeZone(dateString: string): string | null {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       console.error('Invalid date:', dateString);
//       return null;
//     }
//
//     if (this.timezone === 'utc') {
//       const offset = date.getTimezoneOffset() * 60 * 1000;
//       return new Date(date.getTime() + offset).toISOString();
//     }
//     return date.toISOString();
//   }
//
//   objectKeys(obj: Record<string, any> | null): string[] {
//     return obj ? Object.keys(obj) : [];
//   }
//
//   private overrideDate(date: AirDatepickerDate | AirDatepickerDate[]): string | undefined {
//     if (Array.isArray(date)) date = date[0];
//     if (!date) {
//       return undefined;
//     }
//
//     if (typeof date === 'string') {
//       return date;
//     }
//
//     if (typeof date === 'number') {
//       return (new Date(date)).toISOString();
//     }
//
//     if (!isNaN(date.getTime())) {
//       return date.toISOString();
//     }
//
//     return undefined;
//   }
//
//   /**
//    * Get error message for a specific error key.
//    */
//   getErrorMessage(errorKey: string): string {
//     const errorMessages: Record<string, string> = {
//       required: 'This field is required.',
//       invalidDate: 'Invalid date selected.',
//     };
//     return errorMessages[errorKey] || 'Unknown error.';
//   }
// }
