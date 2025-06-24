import {inject, Injectable, Type} from '@angular/core';
import {DialogConfig, DialogService} from '@ngneat/dialog';
import {AlertDialogComponent} from '../sc-dialogs/alert-dialog/alert-dialog.component';
import {InfoDialogComponent} from '../sc-dialogs/info-dialog/info-dialog.component';
import {ErrorDialogComponent} from '../sc-dialogs/error-dialog/error-dialog.component';
import {SuccessDialogComponent} from '../sc-dialogs/success-dialog/success-dialog.component';
import {Observable, Subject, take} from 'rxjs';
import {ConfirmationDialogComponent} from '../sc-dialogs/confirmation-dialog/confirmation-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {NavigationExtras, Router} from '@angular/router';
import {DialogData} from '../core/types/dialog-data';
import {createId} from '@paralleldrive/cuid2';
import {cloneDeep, isEqual} from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ScHelperService {

  private dialog = inject(DialogService);
  private toaster = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  // Observable for components to subscribe to
  private clickSubject = new Subject<HTMLElement | null>();
  public clicks$ = this.clickSubject.asObservable();

  constructor() {
    // Listen to the document click event (only one listener)
    document.addEventListener('click', (event: Event) => {
      this.clickSubject.next(event.target as HTMLElement);
    });
  }

  private createDialogConfig(config?: Partial<DialogConfig<any>>): Partial<DialogConfig<any>> {
    return {
      minHeight: 200,
      ...config,
      id: createId(),
    };
  }

  public dialogCommon<T>(component: Type<T>, config?: Partial<DialogConfig<any>>): Observable<any> {
    return this.dialog.open(component, this.createDialogConfig(config)).afterClosed$.pipe(take(1));
  }

  public dialogConfirmation(dialogData: DialogData, config?: Partial<DialogConfig<any>>) {
    config = {...config, data: dialogData};
    return <Observable<boolean>>this.dialog.open(ConfirmationDialogComponent, this.createDialogConfig(config)).afterClosed$;
  };

  public dialogDeleteConfirmation(modalName: string, config?: Partial<DialogConfig<any>>): Observable<boolean> {
    return this.dialogConfirmation({
      title: 'Delete Confirmation',
      message: `Do you really want to delete the ${modalName}? This process cannot be undone.`
    }, config);
  }

  public dialogSuccess(dialogData: DialogData, config?: Partial<DialogConfig<any>>): Observable<void> {
    config = {...config, data: dialogData};
    return this.dialogCommon(SuccessDialogComponent, this.createDialogConfig(config));
  }

  public dialogError(error: string | { message: string; debugInfo?: any }, config?: Partial<DialogConfig<any>>): Observable<void> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    config = {...config, data: {error: errorMessage}};
    return this.dialogCommon(ErrorDialogComponent, this.createDialogConfig(config));
  }

  public dialogInfo(dialogData: DialogData, config?: Partial<DialogConfig<any>>): Observable<void> {
    if (!dialogData.title) dialogData.title = 'Information';
    config = {...config, data: dialogData};
    return this.dialogCommon(InfoDialogComponent, this.createDialogConfig(config));
  }

  public dialogWarning(dialogData: DialogData, config?: Partial<DialogConfig<any>>): Observable<void> {
    config = {...config, data: dialogData};
    return this.dialogCommon(AlertDialogComponent, this.createDialogConfig(config));
  }

  // Unified Toast Utility
  private readonly defaultToastConfig = {timeOut: 3000, progressBar: true, closeButton: true};

  private showToast(type: 'success' | 'warning' | 'error' | 'info', message: string, config = {}) {
    const toastConfig = {...this.defaultToastConfig, ...config};
    switch (type) {
      case 'success':
        return this.toaster.success(message, '', toastConfig);
      case 'warning':
        return this.toaster.warning(message, '', toastConfig);
      case 'error':
        return this.toaster.error(message, '', toastConfig);
      case 'info':
        return this.toaster.info(message, '', toastConfig);
    }
  }

  toastSuccess = (message: string, config = {}) => this.showToast('success', message, config);
  toastWarning = (message: string, config = {}) => this.showToast('warning', message, config);
  toastError = (message: string, config = {}) => this.showToast('error', message, config);
  toastInfo = (message: string, config = {}) => this.showToast('info', message, config);


  navigate(commands: any[], extras?: NavigationExtras | undefined) {
    this.router.navigate(commands, extras);
  }

  showSpinner = () => { this.spinner.show(); };

  hideSpinner = () => { this.spinner.hide(); };


  getChangedProperties<T extends Record<string, any>>(updated: T, original: Record<string, any>): Partial<T> {
    if (!original) return updated;
    if (!updated) return {} as Partial<T>;
    const result = cloneDeep(updated);
    for (const key of Object.keys(result)) {
      // Skip properties that don't exist in original
      if (!Object.prototype.hasOwnProperty.call(original, key)) continue;
      // Remove properties that are equal
      if (isEqual(result[key], original[key])) {
        delete result[key];
      }
    }
    return result;
  }

}
