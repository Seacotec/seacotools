import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { ScIconComponent } from '../sc-icon/sc-icon.component';

@Component({
  selector: 'sc-button',
  imports: [ScIconComponent, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sc-button.component.html',
})
export class ScButtonComponent implements OnInit {
  @Input() appearance: 'default' | 'pills' | 'outline' = 'default';
  @Input() disabled = false;
  @Input() color:
    | 'blue'
    | 'dark'
    | 'light'
    | 'green'
    | 'red'
    | 'yellow'
    | 'purple' = 'blue';
  @Input() size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' = 'base';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() iconName = ''; // Optional SVG icon name
  @Input() cssClass: string = '';

  @Output() buttonClick = new EventEmitter();

  colorClasses: Record<string, string> = {
    blue: 'text-white bg-blue-900 opacity-95 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-500',
    dark: 'text-white bg-gray-800 opacity-90 hover:bg-gray-700',
    light:
      'text-blue-700 bg-white border border-blue-900 hover:bg-blue-900 opacity-95 hover:text-white dark:bg-gray-800 dark:text-white',
    green:
      'text-white bg-green-900 opacity-90 hover:bg-green-800 dark:bg-green-600',
    red: 'text-white bg-red-800 opacity-80 hover:bg-red-700 dark:bg-red-600',
    yellow:
      'text-gray-800 bg-yellow-500 opacity-90 hover:bg-yellow-400 dark:bg-yellow-500 dark:text-gray-900 dark:hover:bg-yellow-400',
    purple:
      'text-white bg-purple-900 opacity-85 hover:bg-purple-700 dark:bg-purple-600',
  };

  outlineClasses: Record<string, string> = {
    blue: 'text-blue-700 border border-blue-900 hover:bg-blue-900 opacity-95 hover:text-white dark:text-blue-500 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white',
    dark: 'text-gray-800 border border-gray-900 hover:bg-gray-800 opacity-90 hover:text-white dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white',
    light:
      'text-gray-700 border border-gray-500  hover:bg-gray-100 hover:text-blue-700 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white',
    green:
      'text-green-700 border border-green-900 hover:bg-green-900 opacity-90 hover:text-white dark:text-green-500 dark:border-green-500 dark:hover:bg-green-600 dark:hover:text-white',
    red: 'text-red-700 border border-red-800 hover:bg-red-800 opacity-80 hover:text-white dark:text-red-500 dark:border-red-500 dark:hover:bg-red-600 dark:hover:text-white',
    yellow:
      'text-yellow-700 border border-yellow-500 hover:bg-yellow-500 opacity-90 hover:text-white dark:text-yellow-300 dark:border-yellow-300 dark:hover:bg-yellow-400 dark:hover:text-gray-900',
    purple:
      'text-purple-700 border border-purple-900 hover:bg-purple-900 opacity-85 hover:text-white dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-500 dark:hover:text-white',
  };

  sizeClasses: Record<string, string> = {
    xs: 'px-3 py-1 text-xs', // Extra small
    sm: 'px-3 py-1.5 text-sm', // Small
    base: 'px-5 py-2 text-sm', // Default (Base)
    lg: 'px-5 py-2.5 text-base', // Large
    xl: 'px-6 py-3 text-base', // Extra large
  };

  ngOnInit(): void {}
}
