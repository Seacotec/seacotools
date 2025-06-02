import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, forwardRef, inject, Input, OnInit,} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule,} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TippyDirective} from '@ngneat/helipopper';
import {ScIconComponent} from '../sc-icon/sc-icon.component';
import {createId} from '@paralleldrive/cuid2';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';

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
  host: {
    '[attr.data-instance-id]': 'id',
    '[attr.component-type]': '"input"'
  }
})
export class ScInputComponent implements ControlValueAccessor, OnInit {
  id = createId();
  control = new FormControl<string | null>('');
  destroyRef = inject(DestroyRef);
  errorMessageService = inject(ScErrorMessageService);

  private cdr = inject(ChangeDetectorRef)

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
  @Input() showAllErrors = false;


  onChange: (value: any) => void = () => {};
  onTouch: () => void = () => {};

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onChange(value));
    this.cdr.detectChanges();
  }

  writeValue(value: string | null): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = () => {
      this.control.markAsTouched();
      console.log('touched')
      fn();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  errorKeys(errors: Record<string, any> | null): string[] {
    return errors ? Object.keys(errors) : [];
  }

  getErrorMessage(errorKey: string, errorValue: any): string {
    return this.errorMessageService.getErrorMessage(errorKey, errorValue);
  }
}
