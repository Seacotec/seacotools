
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ScErrorMessageService {

  /**
   * Central repository of all validation error messages used throughout the application
   */
  private errorMessages: Record<string, string | ((value: any) => string)> = {
    // Standard Angular validation
    required: 'Required!',
    email: 'Must be a valid email.',
    minlength: (error: any) => `Minimum length is ${error?.requiredLength}, actual length is ${error?.actualLength}`,
    maxlength: (error: any) => `Maximum length is ${error?.requiredLength}, actual length is ${error?.actualLength}`,
    min: (error: any) => `Minimum value is ${error?.min}`,
    max: (error: any) => `Maximum value is ${error?.max}`,
    pattern: 'Value does not match the required pattern',

    // Custom validation
    mismatch: 'Values do not match',
    passwordMismatch: 'Passwords do not match',
    invalidDate: 'Invalid date selected.',

    // Special handling for complex validation
    // These will be checked separately in getErrorMessage
  };

  /**
   * Get the error message for a specific error key and value
   *
   * @param errorKey The key of the error
   * @param errorValue The value of the error
   * @returns A human-readable error message
   */
  getErrorMessage(errorKey: string, errorValue: any): string {
    // Special case for numeric validator
    if (errorKey === 'numeric' && typeof errorValue === 'string') {
      return errorValue;
    }

    // Special case for password validator
    if (errorKey === 'password' && typeof errorValue === 'string') {
      return errorValue;
    }

    // Get the message from our dictionary
    const message = this.errorMessages[errorKey];

    // If the message is a function, call it with the error value
    if (typeof message === 'function') {
      return message(errorValue);
    }

    // If we have a static message, return it
    if (message) {
      return message;
    }

    // If it's a complex object with a message property
    if (errorValue && typeof errorValue === 'object' && errorValue.message) {
      return errorValue.message;
    }

    // Default fallback
    return 'Invalid input.';
  }

  /**
   * Get the first error message from a validation errors object
   *
   * @param errors The validation errors object
   * @returns The first error message or empty string if no errors
   */
  getFirstErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) {
      return '';
    }

    const keys = Object.keys(errors);
    if (keys.length === 0) {
      return '';
    }

    return this.getErrorMessage(keys[0], errors[keys[0]]);
  }
}
