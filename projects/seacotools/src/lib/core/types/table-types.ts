import { TemplateRef } from '@angular/core';

export interface TableColumn {
  label: string; // Column header name
  field: string; // Field in data object
  headerClass?: string; // Optional CSS classes for header (th)
  headerTooltip?: string;
  cellClass?: string; // Optional CSS classes for cell (td)
  template?: TemplateRef<any>; // Custom template for column
  sortable?: boolean; // Enable/disable sorting for the column
  sortType?: 'text' | 'number' | 'boolean'; // Type of data for sorting
}

export interface TableConfig {
  containerClass?: string; // Optional tailwind CSS class for container div
  textClass?: string; // Optional CSS classes for text styling
  headerClass?: string; // Optional CSS classes for header row
  rowClass?: string; // Optional CSS classes for row styling
  rowBorderClass?: string; // Optional CSS classes for row borders
  globalCellClass?: string; // Will apply if cell class not exist
  noDataMessage?: string; // Message to show when no data is available
  noDataClass?: string; // CSS classes for the no-data message
  highlightRows?: boolean; // Enable/disable row highlighting (default: false)
  stickyHeader?: boolean; // Enable/disable sticky header (default: false)
  onRowClick?: (row: any) => void; // Handler function for row click events
}
