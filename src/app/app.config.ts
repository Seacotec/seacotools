import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {BrowserModule} from '@angular/platform-browser';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ToastrModule} from 'ngx-toastr';
import {provideDialogConfig} from '@ngneat/dialog';
import {popperVariation, provideTippyConfig, tooltipVariation} from '@ngneat/helipopper';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      })),
    provideDialogConfig({enableClose: {escape: 'onlyLastStrategy', backdrop: false}}),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      // placement: 'bottom',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation
      }
    }),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
