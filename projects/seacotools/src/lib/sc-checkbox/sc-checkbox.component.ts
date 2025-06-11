import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'sc-checkbox',
  templateUrl: './sc-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScCheckboxComponent),
      multi: true,
    },
  ],
  imports: [ReactiveFormsModule]
})
export class ScCheckboxComponent implements ControlValueAccessor, OnInit {
  private static idCounter = 0;

  control = new FormControl<boolean>(false);
  @Input() label: string = '';
  checkboxId = `sc-checkbox-${++ScCheckboxComponent.idCounter}`;
  destroyRef = inject(DestroyRef);

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.onChange(value);
    });
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
}
