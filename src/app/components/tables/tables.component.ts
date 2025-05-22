import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { TableColumn } from '../../../../projects/seacotools/src/lib/types/table-types';
import { ScTableComponent } from '../../../../projects/seacotools/src/lib/sc-table/sc-table.component';
import {ScIconComponent} from 'seacotools';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  imports: [ScTableComponent, ScIconComponent],
})
export class TablesComponent implements OnInit {
  @ViewChild('actionCell', { static: true }) actionCell!: TemplateRef<any>;

  columns: TableColumn[] = [];
  data = [
    { product: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: 2999 },
    { product: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: 1999 },
    { product: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: 99 },
    { product: 'HP Monitor', color: 'Black', category: 'Accessories', price: 299 },
  ];

  data2 = [
    { product: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: 2999 },
    { product: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: 1999 },
    { product: 'Magic Mouse 2', color: 'Black', category: 'Accessories', price: 99 },
    { product: 'HP Monitor', color: 'Black', category: 'Accessories', price: 299 },
  ];

  // Configuration with and without row highlighting
  defaultConfig = {
    highlightRows: false, // Default table
  };

  highlightConfig = {
    highlightRows: true, // Table with row highlighting
    containerClass: 'shadow-md sm:rounded-lg',
    headerClass: 'bg-gray-50 dark:bg-gray-700 dark:text-gray-300',
  };

  ngOnInit(): void {
    this.columns = [
      { label: 'Product Name', field: 'product'},
      { label: 'Color', field: 'color' },
      { label: 'Category', field: 'category', sortable: true, sortType: 'text'  },
      { label: 'Price', field: 'price', sortable: true, sortType: 'number' },
      {
        label: 'Actions (Centered style)',
        field: '',
        cellClass: 'text-center',
        headerClass: 'justify-center',
        template: this.actionCell,
      },
    ];
  }

  onEdit(row: any): void {
    console.log('Edit clicked for:', row);
  }

  onDelete(row: any): void {
    console.log('Delete clicked for:', row);
  }
}
