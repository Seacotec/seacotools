import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '../types/table-types';

@Component({
  selector: 'sc-table',
  templateUrl: './sc-table.component.html',
  imports: [CommonModule],
})
export class ScTableComponent {
  @Input() columns: TableColumn[] = []; // Column definitions
  @Input() data: any[] = []; // Table data
  @Input() config: TableConfig = {}; // Configuration for styling

  // Get classes with proper fallback values
  get textClass(): string {
    return this.config.textClass || ''; // Always return a string
  }

  get headerClass(): string {
    return this.config.headerClass || 'bg-gray-50 dark:bg-gray-700 dark:text-gray-300';
  }

  get rowClass(): string {
    if (this.config.highlightRows) {
      return (
        this.config.rowClass ||
        'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800'
      );
    }
    return this.config.rowClass || ''; // No highlight fallback
  }

  get rowBorderClass(): string {
    return this.config.rowBorderClass || 'dark:border-gray-700 border-gray-200';
  }
}
