import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {createId} from '@paralleldrive/cuid2';

@Component({
  selector: 'sc-checkbox',
  templateUrl: './sc-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-instance-id]': 'id',
    '[attr.component-type]': '"checkbox"'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScCheckboxComponent),
      multi: true,
    },
  ],
  imports: [
    ReactiveFormsModule
  ]
})
export class ScCheckboxComponent implements ControlValueAccessor, OnInit {
  id = createId();
  control = new FormControl<boolean>(false);
  @Input() label: string = '';
  checkboxId = (Math.random() + 1).toString(36).substring(7);
  destroyRef = inject(DestroyRef);

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.onChange(value);
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
