import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    ]
})
export class ScTextareaComponent implements ControlValueAccessor, OnInit {

  control = new FormControl<string | null>('');
  destroyRef = inject(DestroyRef);
  @Input() label: string = '';
  @Input() required = false;
  @Input() errors: any = null;
  @Input() cssClass = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() rows = 3;

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
}
