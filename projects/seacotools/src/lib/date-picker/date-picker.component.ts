import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import flatpickr from 'flatpickr';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import Instance = flatpickr.Instance;

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ]
})
export class DatePickerComponent implements AfterViewInit, ControlValueAccessor {

  datePicker: Instance;
  @ViewChild('myDatepicker') myDatepicker: ElementRef<HTMLInputElement>;
  private cdr = inject(ChangeDetectorRef);

  @Input() label: string;
  @Input() enableTime = true;
  @Input() noCalendar = false;
  @Input() min: number = DateTime.utc().minus({ year: 2 }).toMillis();
  @Input() max: number = DateTime.utc().toMillis();
  @Input() required: boolean = false;
  @Input() submitted = false;
  date?: DateTime;
  isDisabled = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  ngAfterViewInit(): void {

    const minOffset = DateTime.fromMillis(this.min).offset * 60 * 1000;
    const maxOffset = DateTime.fromMillis(this.max).offset * 60 * 1000;
    const minDate = DateTime.fromMillis(this.min - minOffset).toJSDate();
    const maxDate = DateTime.fromMillis(this.max - maxOffset).toJSDate();

    // console.log('min: ' + DateTime.fromJSDate(minDate).toISO());
    // console.log('max: ' + DateTime.fromJSDate(maxDate).toISO());

    let startDate = DateTime.fromJSDate(maxDate, { zone: 'utc'}).minus({ minute: 120 })
      .set({ minute: 0, second: 0, millisecond: 0 })
      .toJSDate();

    if (this.date) {
      const offset = this.date.offset * 60 * 1000;
      startDate = DateTime.fromMillis(this.date.toMillis() - offset, { zone: 'utc'}).toJSDate();
    }

    let dateFormat = 'd-m-Y H:i';
    if (this.noCalendar) dateFormat = 'H:i';
    if (!this.enableTime) dateFormat = 'd-m-Y';

    const plugins = [];
    if (this.enableTime) {
      plugins.push(confirmDatePlugin({
        confirmText: 'OKAY',
        showAlways: true,
        confirmIcon: ''
      }));
    }

    this.datePicker = flatpickr(this.myDatepicker.nativeElement, {
      allowInput: true,
      minDate: minDate,
      maxDate: maxDate,
      enableTime: this.enableTime,
      noCalendar: this.noCalendar,
      // minuteIncrement: 1,
      dateFormat: dateFormat,
      time_24hr: true,
      defaultDate: this.date ? startDate : undefined,
      plugins: plugins,
      onChange: value => {
        if (value && value.length) {
          const dateTime = DateTime.fromJSDate(value[0]);
          const offset = dateTime.offset * 60 * 1000;
          this.date = dateTime.plus({ millisecond: offset });
          const date = this.date.toISO() as string;
          this.cdr.detectChanges();
          this.onChange(date);
        }
      },
      errorHandler: _ => {
        this.onChange('');
      }
    });

    if (this.isDisabled) this.myDatepicker.nativeElement.disabled = true;

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.datePicker) {
      this.myDatepicker.nativeElement.disabled = isDisabled;
    }
  }

  writeValue(dateString = ''): void {
    const date = DateTime.fromISO(dateString);
    if (date.isValid) {
      this.datePicker ? this.datePicker.setDate(date.toJSDate()) : this.date = date;
    }
  }
}
