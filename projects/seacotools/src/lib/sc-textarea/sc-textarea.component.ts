import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {createId} from '@paralleldrive/cuid2';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';

@Component({
  selector: 'sc-textarea',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sc-textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScTextareaComponent),
      multi: true
    }
  ],
})
export class ScTextareaComponent implements ControlValueAccessor, OnInit {
  errorMessageService = inject(ScErrorMessageService);
  control = new FormControl<string | null>('');
  destroyRef = inject(DestroyRef);
  @Input() label: string = '';
  @Input() required = false;
  @Input() errors: Record<string, any> | null = null;
  @Input() cssClass = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() rows = 3;
  @Input() showAllErrors = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.onChange(value || '');
    });
  }

  writeValue(value: any): void {
    this.control.setValue(value)
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
