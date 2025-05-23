import {Component, ElementRef, EventEmitter, HostListener, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SeacotoolsHelperService} from '../sc-helper-service/seacotools-helper.service';

@Component({
  selector: 'sc-dropdown',
  templateUrl: './sc-dropdown.component.html',
  imports: [],
})
export class ScDropdownComponent implements OnInit, OnDestroy{

  private elementRef = inject(ElementRef);
  private helper = inject(SeacotoolsHelperService);

  @Input() options: { label: string; value: any }[] = []; // Array of {label, value}
  @Input() placeholder: string = 'Select option'; // Customizable placeholder
  @Input() changePlaceholderOnSelect: boolean = false; // Flag to enforce default placeholder
  @Input() buttonClasses: string = ''; // Custom button classes
  @Input() optionClasses: string = ''; // Custom option classes
  @Input() type: 'button'|'text' = 'button';
  @Input() optionsWidthClass = 'w-44';
  @Output() selectionChange = new EventEmitter<any>(); // Emits selected value

  isDropdownOpen = false; // Tracks if dropdown is open
  selectedOption: { label: string; value: any } | null = null; // Tracks selected option

  // Dynamic styles
  dropdownButtonClasses = 'inline-flex items-center cursor-pointer';
  dropdownOptionClasses = '';

  // Subscription to the dropdown service
  private clickSubscription = this.helper.clicks$.subscribe((target) => {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  });

  ngOnInit(): void {
    // Dynamically set classes for the dropdown button
    this.dropdownButtonClasses += this.type === 'button'
      ? ` text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
         focus:outline-none focus:ring-blue-300 px-5 py-2.5 text-center dark:bg-blue-600
         dark:hover:bg-blue-700 dark:focus:ring-blue-800`
      : ` bg-transparent text-gray-700 hover:text-gray-900 dark:hover:text-gray-200`;

    // Append user-defined button classes if provided
    if (this.buttonClasses) {
      this.dropdownButtonClasses += ` ${this.buttonClasses}`;
    }

    if (this.type === 'button' && !this.dropdownButtonClasses.includes('rounded')){
      this.dropdownButtonClasses += ' rounded-lg';
    }

    // Set dynamic option classes
    this.dropdownOptionClasses = `cursor-pointer block px-4 py-2 hover:bg-gray-100
                                   dark:hover:bg-gray-600 dark:hover:text-white ${this.optionsWidthClass}`;
    if (this.optionClasses) {
      this.dropdownOptionClasses += ` ${this.optionClasses}`;
    }
  }

  // Toggles dropdown visibility
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Selects an option and emits its value
  selectOption(option: { label: string; value: any }): void {
    if (this.changePlaceholderOnSelect) this.selectedOption = option;
    this.isDropdownOpen = false;
    this.selectionChange.emit(option.value);
  }

  // HostListener to listen for clicks outside the dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Check if the click is outside the dropdown
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false; // Close the dropdown
    }
  }

  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }
}
