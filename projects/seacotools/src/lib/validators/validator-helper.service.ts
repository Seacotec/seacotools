
import { Injectable, inject } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {ScErrorMessageService} from '../sc-services/sc-error-message.service';


@Injectable({
  providedIn: 'root'
})
export class ValidatorHelperService {

  private errorMessageService = inject(ScErrorMessageService);

  /**
   * Recursively mark all controls in a form as touched
   * Works with nested FormGroups and FormArrays
   *
   * @param formGroup The form group or control to mark as touched
   */
  markAllAsTouched(formGroup: AbstractControl): void {
    if (formGroup instanceof FormControl) {
      formGroup.markAsTouched({ onlySelf: true });
    } else if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.get(key);
        if (control) {
          this.markAllAsTouched(control);
        }
      });
      formGroup.markAsTouched({ onlySelf: true });
    } else if (formGroup instanceof FormArray) {
      formGroup.controls.forEach(control => {
        this.markAllAsTouched(control);
      });
      formGroup.markAsTouched({ onlySelf: true });
    }
  }

  /**
   * Extract validation errors from a form control for use with ScInputComponent
   *
   * @param control The form control to extract errors from
   * @returns Formatted errors compatible with ScInputComponent or null if no errors
   */
  getControlErrors(control: AbstractControl | null): Record<string, any> | null {
    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return null;
    }

    // Pass through the original errors - our components now use the ErrorMessageService
    return control.errors;
  }

  /**
   * Get all errors from a form group for displaying in ScInputComponents
   *
   * @param form The form group to extract errors from
   * @param markAsTouched Whether to mark all controls as touched (useful on form submission)
   * @returns A record mapping control names to their formatted errors
   */
  getFormErrors(form: FormGroup, markAsTouched = false): Record<string, ValidationErrors> {
    if (markAsTouched) {
      this.markAllAsTouched(form);
    }

    const result: Record<string, ValidationErrors> = {};

    // Process all controls including nested ones
    this.processFormGroupErrors(form, '', result);

    return result;
  }

  /**
   * Recursively process errors in a form group
   *
   * @param formGroup The form group to process
   * @param parentPath The path prefix for nested controls
   * @param result The result object to populate
   */
  private processFormGroupErrors(
    formGroup: FormGroup,
    parentPath: string,
    result: Record<string, ValidationErrors>
  ): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

      if (!control) return;

      // If it's a nested FormGroup, process recursively
      if (control instanceof FormGroup) {
        this.processFormGroupErrors(control, currentPath, result);
      }
      // If it's a FormArray, process each item
      else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          if (arrayControl instanceof FormGroup) {
            this.processFormGroupErrors(arrayControl, `${currentPath}[${index}]`, result);
          } else {
            const errors = this.getControlErrors(arrayControl);
            if (errors) {
              result[`${currentPath}[${index}]`] = errors;
            }
          }
        });
      }
      // Regular FormControl
      else {
        const errors = this.getControlErrors(control);
        if (errors) {
          result[currentPath] = errors;
        }
      }
    });
  }



  /**
   * Check if a specific field has a specific error
   *
   * @param form The form group containing the field
   * @param fieldName The name of the field to check
   * @param errorName The error name to check for
   * @returns Boolean indicating if the field has the specified error
   */
  hasFieldError(form: FormGroup, fieldName: string, errorName: string): boolean {
    const control = form.get(fieldName);

    if (!control || !control.errors) {
      return false;
    }

    return !!control.errors[errorName];
  }

  /**
   * Get a human-readable error message for a specific field
   *
   * @param form The form group containing the field
   * @param fieldName The name of the field to check
   * @returns A human-readable error message or empty string if no errors
   */

  getFieldErrorMessage(form: FormGroup, fieldName: string): string {
    const control = form.get(fieldName);

    if (!control || !control.errors) {
      return '';
    }

    return this.errorMessageService.getFirstErrorMessage(control.errors);
  }
}
