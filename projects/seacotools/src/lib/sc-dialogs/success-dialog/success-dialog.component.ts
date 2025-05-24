import {Component, ViewEncapsulation} from '@angular/core';
import {DialogRef} from '@ngneat/dialog';
import {Data} from '@angular/router';
import {ScButtonComponent} from '../../sc-button/sc-button.component';
import {ScIconComponent} from '../../sc-icon/sc-icon.component';

@Component({
  selector: 'sc-success-dialog',
  templateUrl: './success-dialog.component.html',
  imports: [
    ScButtonComponent,
    ScIconComponent
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SuccessDialogComponent {

  constructor(public ref: DialogRef<Data, boolean>) {}

  get title() {
    if (!this.ref.data) return '';
    return this.ref.data['title'];
  }

  get message() {
    if (!this.ref.data) return '';
    return this.ref.data['message'];
  }

}
