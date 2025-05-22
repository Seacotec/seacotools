import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableConfig } from '../types/table-types';
import {ScIconComponent} from '../sc-icon/sc-icon.component';
import {TippyDirective} from '@ngneat/helipopper';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'sc-table',
  templateUrl: './sc-table.component.html',
  imports: [CommonModule, ScIconComponent, TippyDirective],
})
export class ScTableComponent {
  @Input() columns: TableColumn[] = []; // Column definitions
  @Input() data: any[] = []; // Table data
  @Input() config: TableConfig = {}; // Configuration for styling

  // Sorting state
  currentSortField: string | null = null;
  currentSortDirection: SortDirection = 'asc';


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

  // Sort data by a column
  sortData(column: TableColumn): void {
    if (!column.sortable || !column.field) {
      return;
    }

    const sortField = column.field;

    if (this.currentSortField === sortField) {
      // If already sorted on this field, reverse the direction
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Sort on this new field in ascending direction
      this.currentSortField = sortField;
      this.currentSortDirection = 'asc';
    }

    const sortDirection = this.currentSortDirection;

    // Sort the data
    this.data.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      // Handle null/undefined/empty values
      if (valueA == null || valueA === '') return sortDirection === 'asc' ? 1 : -1;
      if (valueB == null || valueB === '') return sortDirection === 'asc' ? -1 : 1;

      if (column.sortType === 'number') {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      } else if (column.sortType === 'boolean') {
        // Convert to numbers (true = 1, false = 0) and compare
        return sortDirection === 'asc'
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      } else {
        // Fallback to text sorting
        const valA = valueA.toString().toLowerCase();
        const valB = valueB.toString().toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }

}
