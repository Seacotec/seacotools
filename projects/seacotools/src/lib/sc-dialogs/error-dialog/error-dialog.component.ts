import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { Data } from '@angular/router';
import {ScButtonComponent} from '../../sc-button/sc-button.component';
import {ScIconComponent} from '../../sc-icon/sc-icon.component';

@Component({
    selector: 'sc-error-dialog',
    templateUrl: './error-dialog.component.html',
  imports: [
    ScButtonComponent,
    ScIconComponent
  ]
})
export class ErrorDialogComponent implements OnInit {

  constructor(public ref: DialogRef<Data, boolean>) {}

  get error() {
    if (!this.ref.data) return '';
    return this.ref.data['error'];
  }

  ngOnInit(): void {
  }

}
