import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TippyDirective} from '@ngneat/helipopper';
import {ScIconComponent} from '../sc-icon/sc-icon.component';


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
  ]
})
export class ScSelectComponent implements ControlValueAccessor, OnInit {
  control = new FormControl(null);
  destroyRef = inject(DestroyRef);
  id = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
  @Input() options: Array<Record<string, any> | string | number> = [];
  @Input() label?: string;
  @Input() questionMark?: string;
  @Input() errors: Record<string, any> | null = null;
  @Input() key: string = '';
  @Input() keys?: string[];
  @Input() required = false;
  @Input() firstEmpty = false;
  @Input() submitted = false;
  @Input() defaultHeight = true;

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
      'border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none',
      'w-full px-2 py-2 mb-2 bg-gray-50 placeholder-gray-500 dark:bg-gray-700',
      this.errors && !this.control.untouched ? 'border-red-500' : 'border-gray-400',
      this.control.disabled ? 'text-gray-600 bg-stone-300' : '',
      this.defaultHeight ? 'h-9' : '',
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
}
