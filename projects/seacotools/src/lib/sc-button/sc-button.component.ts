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
    | 'purple'
    | 'gray' = 'blue';
  @Input() size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' = 'base';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() iconName = ''; // Optional SVG icon name
  @Input() cssClass: string = '';

  @Output() buttonClick = new EventEmitter();

  // Shared across every variant: reserve the 1px border slot so buttons never
  // shift size between colors, keep a smooth color transition, and expose an
  // accessible focus ring + a consistent disabled state.
  baseClasses =
    'border transition-colors focus:outline-none focus:ring-4 disabled:opacity-60';

  // Solid buttons. Border matches the background (darkened on hover) so the
  // shape stays crisp on any page. `dark`/`light` instead use the opposite
  // border color (white on dark, dark on light) and invert their fill/text on
  // hover, so the border stays visible in both light and dark modes.
  colorClasses: Record<string, string> = {
    blue: 'text-white bg-blue-700 border-blue-700 hover:bg-blue-800 hover:border-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:focus:ring-blue-800',
    dark: 'text-gray-100 bg-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-400 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-300 dark:hover:bg-gray-100 dark:hover:text-gray-800 dark:hover:border-gray-400 dark:focus:ring-gray-700',
    light:
      'text-gray-700 bg-white border-gray-400 hover:bg-gray-700 hover:text-gray-100 hover:border-gray-600 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500 dark:hover:bg-gray-100 dark:hover:text-gray-800 dark:hover:border-gray-400 dark:focus:ring-gray-700',
    green:
      'text-white bg-green-700 border-green-700 hover:bg-green-800 hover:border-green-800 focus:ring-green-300 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-700 dark:hover:border-green-700 dark:focus:ring-green-800',
    red: 'text-white bg-red-700 border-red-700 hover:bg-red-800 hover:border-red-800 focus:ring-red-300 dark:bg-red-600 dark:border-red-600 dark:hover:bg-red-700 dark:hover:border-red-700 dark:focus:ring-red-900',
    yellow:
      'text-gray-900 bg-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500 focus:ring-yellow-300 dark:bg-yellow-500 dark:border-yellow-500 dark:text-gray-900 dark:hover:bg-yellow-400 dark:hover:border-yellow-400 dark:focus:ring-yellow-800',
    purple:
      'text-white bg-purple-700 border-purple-700 hover:bg-purple-800 hover:border-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:border-purple-600 dark:hover:bg-purple-700 dark:hover:border-purple-700 dark:focus:ring-purple-900',
    gray: 'text-white bg-gray-500 border-gray-500 hover:bg-gray-600 hover:border-gray-600 focus:ring-gray-300 dark:bg-gray-500 dark:border-gray-500 dark:hover:bg-gray-600 dark:hover:border-gray-600 dark:focus:ring-gray-800',
  };

  // Outline buttons: transparent fill + colored border, filling in on hover.
  outlineClasses: Record<string, string> = {
    blue: 'text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-blue-300 dark:text-blue-500 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800',
    dark: 'text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white focus:ring-gray-300 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-700',
    light:
      'text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-200 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700',
    green:
      'text-green-700 border-green-700 hover:bg-green-700 hover:text-white focus:ring-green-300 dark:text-green-500 dark:border-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-green-800',
    red: 'text-red-700 border-red-700 hover:bg-red-700 hover:text-white focus:ring-red-300 dark:text-red-500 dark:border-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900',
    yellow:
      'text-yellow-600 border-yellow-500 hover:bg-yellow-500 hover:text-white focus:ring-yellow-300 dark:text-yellow-300 dark:border-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-gray-900 dark:focus:ring-yellow-800',
    purple:
      'text-purple-700 border-purple-700 hover:bg-purple-800 hover:text-white focus:ring-purple-300 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-500 dark:hover:text-white dark:focus:ring-purple-900',
    gray: 'text-gray-500 border-gray-500 hover:bg-gray-500 hover:text-white focus:ring-gray-300 dark:text-gray-400 dark:border-gray-500 dark:hover:bg-gray-500 dark:hover:text-white dark:focus:ring-gray-800',
  };

  sizeClasses: Record<string, string> = {
    xs: 'px-3 py-1 text-xs', // Extra small
    sm: 'px-3 py-1.5 text-sm', // Small
    base: 'px-5 py-2 text-sm', // Default (Base)
    lg: 'px-5 py-2.5 text-base', // Large
    xl: 'px-6 py-3 text-base', // Extra large
  };

  iconSizeClasses: Record<string, string> = {
    xs: 'me-2 w-3 h-3', // Extra small
    sm: 'me-2 w-3.5 h-3.5', // Small
    base: 'me-2 w-4 h-4', // Default (Base)
    lg: 'me-2 w-5 h-5', // Large
    xl: 'me-2 w-6 h-6', // Extra large
  };

  ngOnInit(): void {}
}
