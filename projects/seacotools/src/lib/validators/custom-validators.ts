import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

export class CustomValidators {
  /**
   * Validates that an input value is numeric and optionally restricts decimal places
   *
   * @param decimalPlaces Maximum number of decimal places allowed (default: 0)
   * @returns ValidatorFn that validates numeric input with decimal place restrictions
   */
  static numeric(decimalPlaces: number = 0): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Skip validation if control is empty or invalid
      if (Validators.required(control) || !control.value) {
        return null;
      }

      const value = control.value.toString().trim();

      // Check if value is numeric
      if (!/^-?\d*\.?\d*$/.test(value) || isNaN(+value)) {
        return { numeric: 'Must be a valid number' };
      }

      // Check decimal places constraint
      const parts = value.split('.');
      if (parts.length > 1 && parts[1].length > decimalPlaces) {
        return {
          numeric: `Maximum ${decimalPlaces} decimal place${decimalPlaces !== 1 ? 's' : ''} allowed`
        };
      }

      return null;
    };
  }

  /**
   * Validates password strength based on configurable requirements
   *
   * @param options Configuration options for password validation
   * @returns ValidatorFn that validates password strength
   */
  static password(options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChar?: boolean;
  }): ValidatorFn {
    // Default options
    const config = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChar: false,
      ...options
    };

    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value;

      // Collect requirements that fail
      const failedRequirements = [];

      // Check minimum length
      if (value.length < config.minLength) {
        failedRequirements.push(`minimum ${config.minLength} characters`);
      }

      // Check for uppercase letters
      if (config.requireUppercase && !/[A-Z]/.test(value)) {
        failedRequirements.push('uppercase letter');
      }

      // Check for lowercase letters
      if (config.requireLowercase && !/[a-z]/.test(value)) {
        failedRequirements.push('lowercase letter');
      }

      // Check for numbers
      if (config.requireNumbers && !/\d/.test(value)) {
        failedRequirements.push('number');
      }

      // Check for special characters
      if (config.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        failedRequirements.push('special character');
      }

      // If any requirements failed, return error
      if (failedRequirements.length > 0) {
        // Create a human-readable message for ScInputComponent
        const message = `Password must contain: ${failedRequirements.join(', ')}`;
        return { password: message };
      }

      return null;
    };
  }

  /**
   * Validates that two fields in a form group match
   *
   * @param controlPath Path to the control to compare against
   * @param matchingControlPath Path to the control that should match
   * @param errorKey Custom error key (default: 'mismatch')
   * @returns ValidatorFn for form group validation
   */
  static match(
    controlPath: string,
    matchingControlPath: string,
    errorKey: string = 'mismatch'
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlPath);
      const matchingControl = formGroup.get(matchingControlPath);

      // Return if controls not found or one is disabled
      if (!control || !matchingControl || control.disabled || matchingControl.disabled) {
        return null;
      }

      // Check if values match
      if (control.value !== matchingControl.value) {
        // Create a message directly usable by ScInputComponent
        const errorValue = errorKey === 'passwordMismatch' ? 'Passwords do not match' : 'Values do not match';
        const error = { [errorKey]: errorValue };

        // Mark the matching control as having this error
        matchingControl.setErrors({ ...matchingControl.errors, ...error });

        return error;
      } else {
        // Clear the error on the matching control if it exists
        if (matchingControl.errors) {
          const errors = { ...matchingControl.errors };
          delete errors[errorKey];

          matchingControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }

      return null;
    };
  }

  /**
   * Specific validator for password matching (a common use case)
   *
   * @param passwordPath Path to password control (default: 'password')
   * @param confirmPasswordPath Path to confirm password control (default: 'confirmPassword')
   * @returns ValidatorFn for form group validation
   */
  static passwordMatch(
    passwordPath: string = 'password',
    confirmPasswordPath: string = 'confirmPassword'
  ): ValidatorFn {
    return this.match(passwordPath, confirmPasswordPath, 'passwordMismatch');
  }
}
