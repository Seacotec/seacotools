import {Component, inject} from '@angular/core';
import {ScButtonComponent} from '../../../../projects/seacotools/src/lib/sc-button/sc-button.component';
import {ScHelperService} from '../../../../projects/seacotools/src/lib/sc-services/sc-helper.service';
import {ScDropdownComponent} from '../../../../projects/seacotools/src/lib/sc-dropdown/sc-dropdown.component';
import {ScIconComponent} from 'seacotools';

@Component({
  selector: 'app-overview',
  imports: [ScButtonComponent, ScDropdownComponent, ScIconComponent],
  templateUrl: './overview.component.html',
})
export class OverviewComponent {

  helper = inject(ScHelperService);

  dropdownOptions = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Settings', value: 'settings' },
    { label: 'Earnings', value: 'earnings' },
    { label: 'Sign out', value: 'signout' },
  ];

  handleSelection(value: any): void {
    console.log(value);
    this.helper.toastInfo('Selected: ' + value);
  }


  infoDialog() {
    this.helper.dialogInfo({
      title: 'Info',
      message: 'This is an info dialog'
    });
  }

  alertDialog() {
    this.helper.dialogWarning({
      title: 'Warning',
      message: 'This is a warning dialog'
    });
  }

  successDialog() {
    this.helper.dialogSuccess({
      title: 'Success',
      message: 'This is a Success dialog'
    });
  }

  errorDialog() {
    this.helper.dialogError({
      message: 'This is an Error dialog'
    });
  }

  confirmationDialog() {
    this.helper.dialogConfirmation({
      title: 'Do you accept this?',
      message: 'This is a Confirmation dialog'
    });
  }
}
