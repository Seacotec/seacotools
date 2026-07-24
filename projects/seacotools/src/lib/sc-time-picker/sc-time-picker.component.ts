import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import flatpickr from 'flatpickr';
import {Instance} from 'flatpickr/dist/types/instance';
import {Options} from 'flatpickr/dist/types/options';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import {ScIconComponent} from '../sc-icon/sc-icon.component';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';

/**
 * Reusable 24h time picker input. Drop-in compatible with the seacollect
 * `app-time-picker`: same input API and value round-trip.
 *
 * Value handling:
 *  - A plain `HH:mm` string is stored and emitted as-is.
 *  - An ISO datetime string (containing `T`) keeps its date part; the input
 *    edits the UTC time and re-emits an ISO string.
 */
@Component({
  selector: 'sc-time-picker',
  standalone: true,
  templateUrl: './sc-time-picker.component.html',
  imports: [CommonModule, ReactiveFormsModule, ScIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScTimePickerComponent),
      multi: true,
    },
  ],
})
export class ScTimePickerComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('myTimepicker') myTimepicker!: ElementRef<HTMLInputElement>;

  private cdr = inject(ChangeDetectorRef);
  private errorMessageService = inject(ScErrorMessageService);

  @Input() label = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() errors: Record<string, any> | null = null;
  @Input() min: string | number | null = null;
  @Input() max: string | number | null = null;
  @Input() disabled = false;

  value: string | null = null;
  private currentDate: Date | null = null;
  timeError = signal<string | null>(null);

  private timePicker?: Instance;

  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  get hasError(): boolean {
    return (
      (!!this.errors && this.submitted) ||
      (this.submitted && this.required && !this.value) ||
      !!this.timeError()
    );
  }

  get computedClasses(): string {
    const defaultClasses =
      'outline-none disabled:text-gray-600 disabled:bg-gray-300 dark:placeholder:text-gray-300 ' +
      'dark:disabled:bg-gray-500 dark:text-gray-100 dark:disabled:text-gray-300 bg-input-field w-full px-3 border rounded ' +
      'focus:border-indigo-500 h-9 placeholder-gray-500 placeholder-opacity-70';

    const borderColorClass = this.hasError ? 'border-red-500' : 'border-gray-400 dark:border-gray-700';
    const bgColorClass = 'bg-gray-50 dark:bg-gray-600';

    return `${defaultClasses} ${borderColorClass} ${bgColorClass}`;
  }

  ngAfterViewInit(): void {
    this.initTimePicker();

    if (this.value) {
      this.syncPickerDate();
    }

    if (this.disabled && this.timePicker?._input) {
      this.timePicker._input.disabled = true;
    }
  }

  private initTimePicker(): void {
    const timeOptions: Partial<Options> = {
      enableTime: true,
      noCalendar: true,
      allowInput: true,
      clickOpens: false,
      dateFormat: 'H:i',
      time_24hr: true,
      minTime: this.resolveTimeBound(this.min),
      maxTime: this.resolveTimeBound(this.max),
      plugins: [
        confirmDatePlugin({
          confirmText: 'OKAY',
          showAlways: true,
          confirmIcon: '',
        }),
      ],
      onChange: (value: Date[]) => {
        if (value && value.length) {
          const date = value[0];
          this.updateValueInternal(date.getHours(), date.getMinutes());
        }
      },
    };

    if (this.myTimepicker?.nativeElement) {
      this.timePicker = flatpickr(this.myTimepicker.nativeElement, timeOptions);
    }
  }

  /** Normalizes a min/max bound into a flatpickr `HH:mm` string, if provided. */
  private resolveTimeBound(bound: string | number | null): string | undefined {
    if (bound === null || bound === undefined || bound === '') return undefined;
    return typeof bound === 'number' ? String(bound) : bound;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.timePicker?._input) {
      this.timePicker._input.disabled = isDisabled;
    }
    this.cdr.detectChanges();
  }

  writeValue(obj: any): void {
    if (obj) {
      if (typeof obj === 'string' && obj.includes('T')) {
        const date = new Date(obj);
        if (!isNaN(date.getTime())) {
          this.currentDate = date;
          this.value = `${this.pad(date.getUTCHours())}:${this.pad(date.getUTCMinutes())}`;
        }
      } else {
        this.value = obj;
        this.currentDate = null;
      }
    } else {
      this.value = null;
      this.currentDate = null;
    }

    if (this.timePicker) {
      if (this.value) {
        this.syncPickerDate();
      } else {
        this.timePicker.clear();
      }
    }
    this.cdr.detectChanges();
  }

  private syncPickerDate(): void {
    if (!this.timePicker || !this.value) return;

    const [hour, minute] = this.value.split(':').map(Number);
    if (!isNaN(hour) && !isNaN(minute)) {
      const d = new Date();
      d.setHours(hour, minute, 0, 0);
      this.timePicker.setDate(d, false);
    }
  }

  openTimePicker(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) return;
    this.timePicker?.open();
  }

  onTimeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isBackspace =
      (event as InputEvent).inputType === 'deleteContentBackward' ||
      (event as InputEvent).inputType === 'deleteContentForward';
    let rawValue = input.value.replace(/[^0-9]/g, '');

    if (rawValue.length > 4) {
      rawValue = rawValue.substring(0, 4);
    }

    this.timeError.set(null);
    input.value = this.formatTime(rawValue, isBackspace);

    if (rawValue.length >= 2) {
      const hours = parseInt(rawValue.substring(0, 2), 10);
      if (hours > 23) {
        this.timeError.set('Hours cannot be bigger than 23');
        return;
      }
    }

    if (rawValue.length >= 4) {
      const minutes = parseInt(rawValue.substring(2, 4), 10);
      if (minutes > 59) {
        this.timeError.set('Minutes cannot be bigger than 59');
        return;
      }
    }

    if (rawValue.length === 4) {
      const hours = parseInt(rawValue.substring(0, 2), 10);
      const minutes = parseInt(rawValue.substring(2, 4), 10);

      if (hours < 24 && minutes < 60) {
        this.timeError.set(null);
        this.updateValueInternal(hours, minutes);

        if (this.timePicker) {
          const d = new Date();
          d.setHours(hours, minutes, 0, 0);
          this.timePicker.setDate(d, false);
        }
      }
    }
  }

  onTimeBlur(): void {
    this.onTouched();
    const input = this.myTimepicker?.nativeElement;
    if (input) {
      const cleanValue = input.value.replace(/[^0-9]/g, '');
      if (cleanValue.length === 0) {
        this.value = null;
        this.timeError.set(null);
        this.onChange(null);
      } else if (cleanValue.length !== 4) {
        this.timeError.set('Please enter HH:MM format');
      }
    }
  }

  private formatTime(cleanValue: string, isBackspace: boolean): string {
    if (cleanValue.length >= 2) {
      if (cleanValue.length === 2 && isBackspace) {
        return cleanValue;
      }
      return cleanValue.substring(0, 2) + ':' + cleanValue.substring(2);
    }
    return cleanValue;
  }

  onTimeKeydown(event: KeyboardEvent): void {
    if (!this.timePicker || this.disabled) return;

    const openKeys = ['Enter', ' ', 'ArrowDown'];
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      this.timePicker.open();
      return;
    }

    if (openKeys.includes(event.key)) {
      if (!this.timePicker.isOpen) {
        event.preventDefault();
        this.timePicker.open();
      }
      return;
    }

    if (event.key === 'Escape' && this.timePicker.isOpen) {
      event.preventDefault();
      this.timePicker.close();
    }
  }

  private updateValueInternal(hours: number, minutes: number): void {
    this.value = `${this.pad(hours)}:${this.pad(minutes)}`;
    if (this.currentDate) {
      const date = new Date(this.currentDate.getTime());
      date.setUTCHours(hours, minutes, 0, 0);
      this.currentDate = date;
      this.onChange(date.toISOString());
    } else {
      this.onChange(this.value);
    }
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  errorKeys(errors: Record<string, any> | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    return this.errorMessageService.getErrorMessage(errorKey, errorValue);
  }

  ngOnDestroy(): void {
    if (this.timePicker) {
      this.timePicker.destroy();
    }
  }
}
