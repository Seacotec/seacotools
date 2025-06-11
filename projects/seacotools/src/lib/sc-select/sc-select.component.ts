import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TippyDirective} from '@ngneat/helipopper';
import {ScIconComponent} from '../sc-icon/sc-icon.component';
import {createId} from '@paralleldrive/cuid2';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';


@Component({
  selector: 'sc-select',
  templateUrl: './sc-select.component.html',
  imports: [CommonModule, ReactiveFormsModule, TippyDirective, ScIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScSelectComponent),
      multi: true
    }
  ],
})
export class ScSelectComponent implements ControlValueAccessor, OnInit {

  errorMessageService = inject(ScErrorMessageService);
  control = new FormControl(null);
  destroyRef = inject(DestroyRef);

  @Input() options: Array<Record<string, any> | string | number> = [];
  @Input() label?: string;
  @Input() questionMark?: string;
  @Input() errors: Record<string, any> | null = null;
  @Input() key: string = '';
  @Input() keys?: string[];
  @Input() required = false;
  @Input() firstEmpty = false;
  @Input() showAllErrors = false;

  onChange: any = () => {};
  onTouch: any = () => {};


  get displayValue(): (option: any) => string {
    return (option: any): string => {
      if (this.keys?.length) {
        return this.keys.map((key) => option[key]).join(' - ') || '';
      }
      return option?.toString() || '';
    };
  }

  get selectClasses(): string {
    return [
      'w-full rounded-lg border bg-gray-50 px-3 py-2 outline-none placeholder-gray-500 focus:border-indigo-500',
      'focus:ring focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:disabled:bg-gray-600',
      this.errors && !this.control.untouched ? 'border-red-500' : 'border-gray-400',
      this.control.disabled ? 'cursor-not-allowed bg-gray-300 text-gray-600' : '',
    ].join(' ');
  }

  ngOnInit(): void {
    this.initKeys();
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (this.onChange) this.onChange(value);
    });
  }

  private initKeys(): void {
    if (!this.keys && this.key) {
      this.keys = [this.key];
    }
  }

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
    isDisabled ? this.control.disable() : this.control.enable();
  }

  errorKeys(errors: Record<string, any> | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    return this.errorMessageService.getErrorMessage(errorKey, errorValue);
  }
}
