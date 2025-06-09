import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import {TableColumn, TableConfig} from '../../../../projects/seacotools/src/lib/core/types/table-types';
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
  customColumns: TableColumn[] = [];
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
  ];

  data3 = [
    { product: 'Apple MacBook Pro 17"', color: 'Silver', category: 'Laptop', price: 2999 },
    { product: 'Microsoft Surface Pro', color: 'White', category: 'Laptop PC', price: 1999 },
  ];

  customStylingConfig: TableConfig = {
    containerClass: 'shadow-md sm:rounded-lg',
    headerClass: 'bg-green-100 dark:bg-green-800 text-blue-600 dark:text-yellow-500',
    globalCellClass: 'px-6 py-4 whitespace-nowrap',
    onRowClick: (row) => {
      console.log('Row clicked:', row);
    }
  };

  ngOnInit(): void {
    this.columns = [
      { label: 'Product Name', field: 'product'},
      { label: 'Color', field: 'color', sortable: true, sortType: 'text' },
      { label: 'Category', field: 'category', sortable: true, sortType: 'text'  },
      { label: 'Price', field: 'price', sortable: true, sortType: 'number' },
      {
        label: 'Actions (Centered style)',
        field: '',
        cellClass: 'text-center',
        headerClass: 'text-center',
        template: this.actionCell,
      },
    ];
    this.customColumns = [
      { label: 'Product Name', field: 'product'},
      { label: 'Color', field: 'color', cellClass: 'text-red-500' },
      { label: 'Category', field: 'category', sortable: true, sortType: 'text'  },
      { label: 'Price', field: 'price', sortable: true, sortType: 'number' },
      {
        label: 'Actions (Centered style)',
        field: '',
        cellClass: 'text-center',
        headerClass: 'text-center',
        template: this.actionCell,
      },
    ]
  }

  onEdit(row: any): void {
    console.log('Edit clicked for:', row);
  }

  onDelete(row: any): void {
    console.log('Delete clicked for:', row);
  }
}
