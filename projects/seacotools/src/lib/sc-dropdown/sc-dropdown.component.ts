import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sc-dropdown',
  templateUrl: './sc-dropdown.component.html',
  imports: [NgClass],
})
export class ScDropdownComponent implements OnInit{

  @Input() options: { label: string; value: any }[] = []; // Array of {label, value}
  @Input() placeholder: string = 'Select option'; // Customizable placeholder
  @Input() changePlaceholderOnSelect: boolean = false; // Flag to enforce default placeholder
  @Input() buttonClasses: string = ''; // Custom button classes
  @Input() optionClasses: string = ''; // Custom option classes
  @Input() buttonType: string = 'button'; // Type of the dropdown button
  @Input() optionsWidthClass = 'w-44';
  @Output() selectionChange = new EventEmitter<any>(); // Emits selected value

  isDropdownOpen = false; // Tracks if dropdown is open
  selectedOption: { label: string; value: any } | null = null; // Tracks selected option

  ngOnInit(): void {
    if (!this.buttonClasses.includes('rounded')){
      this.buttonClasses += ' rounded-lg';
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
}
