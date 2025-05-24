import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { Data } from '@angular/router';
import {ScButtonComponent} from '../../sc-button/sc-button.component';
import {ScIconComponent} from '../../sc-icon/sc-icon.component';

@Component({
    selector: 'sc-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
  imports: [
    ScButtonComponent,
    ScIconComponent,
  ]
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(public ref: DialogRef<Data, boolean>) {}

  get title() {
    if (!this.ref.data) return '';
    return this.ref.data['title'];
  }

  get message() {
    if (!this.ref.data) return '';
    return this.ref.data['message'];
  }

  get declineButton() {
    if (!this.ref.data) return '';
    return this.ref.data['declineButton'];
  }

  get acceptButton() {
    if (!this.ref.data) return '';
    return this.ref.data['acceptButton'];
  }

  ngOnInit(): void { }

  close(response: boolean){
    this.ref.close(response);
  }
}
