import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';

@Directive({
  selector: '[scValidationError]'
})
export class ValidationErrorDirective implements OnInit, OnChanges, OnDestroy {
  @Input() scValidationError: Record<string, string> = {};
  @Input() showErrorOnTouched = true;
  @Input() errorDisplayMode: 'auto' | 'manual' = 'auto';

  // For manual error display (when used outside reactive forms)
  @Input() errorMessage: string = '';
  @Input() showError = false;

  private errorElement: HTMLElement | null = null;
  private subscription: Subscription | null = null;
  private errorMessageService = inject(ScErrorMessageService);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    if (this.errorDisplayMode === 'auto' && this.ngControl?.control) {
      this.subscription = this.ngControl.control.statusChanges.subscribe(() => {
        this.updateErrorMessage();
      });
    }
  }

  ngOnChanges(): void {
    if (this.errorDisplayMode === 'auto') {
      this.updateErrorMessage();
    } else {
      // Manual mode - directly use the inputs
      if (this.showError && this.errorMessage) {
        this.showErrorMessage(this.errorMessage);
      } else {
        this.removeErrorElement();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.removeErrorElement();
  }

  private updateErrorMessage(): void {
    const control = this.ngControl?.control;

    if (!control) {
      return;
    }

    // Check if we should show errors
    const showError = control.invalid &&
      (control.dirty || (this.showErrorOnTouched && control.touched));

    if (showError) {
      const message = this.errorMessageService.getFirstErrorMessage(control.errors);
      this.showErrorMessage(message);
    } else {
      this.removeErrorElement();
    }
  }

  private showErrorMessage(message: string): void {
    if (!message) {
      this.removeErrorElement();
      return;
    }

    if (!this.errorElement) {
      this.errorElement = this.renderer.createElement('div');
      this.renderer.addClass(this.errorElement, 'validation-error');
      this.renderer.setStyle(this.errorElement, 'color', 'red');
      this.renderer.setStyle(this.errorElement, 'font-size', '0.75rem');
      this.renderer.setStyle(this.errorElement, 'margin-top', '0.25rem');

      // Add after the element
      const parent = this.renderer.parentNode(this.el.nativeElement);
      this.renderer.insertBefore(
        parent,
        this.errorElement,
        this.renderer.nextSibling(this.el.nativeElement)
      );
    }

    this.renderer.setProperty(this.errorElement, 'textContent', message);
  }

  private removeErrorElement(): void {
    if (this.errorElement) {
      const parent = this.renderer.parentNode(this.errorElement);
      this.renderer.removeChild(parent, this.errorElement);
      this.errorElement = null;
    }
  }
}
