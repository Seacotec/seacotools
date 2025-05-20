import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploadComponent),
            multi: true
        }
    ],
    imports: [
        FileUploadModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {

  control!: FormControl;
  destroyRef = inject(DestroyRef);
  touched = false;
  @Input() label: string = '';
  @Input() required = false;
  @Input() multiple = true;
  @Input() accept = ['pdf/*', 'image/*'];
  @Input() filesLimit = 5;
  @Input() fileSize = 3;
  @Input() discardInvalid = false;
  @Input() animation = true;
  @Input() submitted = false;
  onChange: any = () => {};
  onTouch: any = () => {};


  ngOnInit(): void {
    this.control = new FormControl([],
      [
        FileUploadValidators.filesLimit(this.filesLimit),
        FileUploadValidators.fileSize(this.fileSize * 1048576),
      ].concat(this.accept.length ? [FileUploadValidators.accept(this.accept)] : [])
    );

    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(files => {
      this.onChange(files || []);
    });
  }

  writeValue(value: File[]): void {
    this.control.setValue(value || []);
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
