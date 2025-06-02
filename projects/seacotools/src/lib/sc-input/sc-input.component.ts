import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TippyDirective } from '@ngneat/helipopper';
import { ScIconComponent } from '../sc-icon/sc-icon.component';

@Component({
  selector: 'sc-input',
  templateUrl: './sc-input.component.html',
  imports: [CommonModule, ReactiveFormsModule, TippyDirective, ScIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScInputComponent),
      multi: true,
    },
  ],
})
export class ScInputComponent implements ControlValueAccessor, OnInit {
  control = new FormControl<string | null>('');
  destroyRef = inject(DestroyRef);
  id = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .substring(2, 5)}`;

  @Input() label = '';
  @Input() required = false;
  @Input() errors: Record<string, any> | null = null;
  @Input() cssClass = '';
  @Input() inputType: 'text' | 'number' | 'email' | 'password' | 'tel' = 'text';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() submitted = false;
  @Input() questionMark = '';
  @Input() variant: 'default' | 'floatingLabel' = 'default';

  onChange: (value: any) => void = () => {};
  onTouch: () => void = () => {};

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onChange(value));
  }

  writeValue(value: string | null): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  errorKeys(errors: Record<string, any> | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    const messages: Record<string, string> = {
      email: 'Must be a valid email.',
      minlength: `Minimum length is ${errorValue?.requiredLength}, actual length is ${errorValue?.actualLength}`,
      maxlength: `Maximum length is ${errorValue?.requiredLength}, actual length is ${errorValue?.actualLength}`,
      max: `Maximum value is ${errorValue?.max}`,
      min: `Minimum value is ${errorValue?.min}`,
      required: 'Required!',
      numeric: errorValue,
      password: errorValue,
    };
    return messages[errorKey] || 'Invalid input.';
  }
}
