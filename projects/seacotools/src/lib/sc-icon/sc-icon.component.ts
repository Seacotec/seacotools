import {ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {createId} from '@paralleldrive/cuid2';

@Component({
  selector: 'sc-icon',
  host: {
    '[attr.data-instance-id]': 'id',
    '[attr.component-type]': '"searchable-icon"'
  },
  template: `
    <svg
      [innerHTML]="safeSvgContent"
      [attr.class]="computedClass">
    </svg>
  `,
})
export class ScIconComponent implements OnChanges {
  id = createId();
  private sanitizer = inject(DomSanitizer);
  private changeDetector = inject(ChangeDetectorRef);

  // Define sc-input properties
  @Input({required: true}) name: string = ''; // The name of the icon (e.g., 'home', 'user').
  @Input() appearance: 'outline' | 'solid' = 'outline'; // The style of the icon.
  @Input() class: string = ''; // Additional classes for styling.

  // Holds the SVG content
  svgContent: string = '';

  // Holds the sanitized SVG content
  safeSvgContent: SafeHtml = '';

  // Final computed class for the component
  computedClass: string = '';


  // Process the sc-input classes: ensure w-* and h-* exist

  // Detect changes to sc-input properties
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.computedClass = this.processClasses(this.class);
    // React to changes in inputs (e.g., name or appearance)
    if (changes['name'] || changes['appearance']) {
      this.updateSvgContent();
    }
  }

  private processClasses(inputClass: string): string {
    const hasWidth = inputClass.match(/w-\d+/); // Match width classes like w-10, w-16
    const hasHeight = inputClass.match(/h-\d+/); // Match height classes like h-10, h-16

    let updatedClass = inputClass;

    if (hasWidth) {
      // If width exists but height doesn't, add matching height
      const widthValue = hasWidth[0].split('-')[1]; // Extract the number
      if (!hasHeight) {
        updatedClass += ` h-${widthValue}`;
      }
    } else if (hasHeight) {
      // If height exists but width doesn't, add matching width
      const heightValue = hasHeight[0].split('-')[1];
      updatedClass += ` w-${heightValue}`;
    } else {
      // If neither width nor height exists, add the default classes
      updatedClass += ' w-5 h-5';
    }

    return updatedClass.trim(); // Return the final processed class
  }

  // Method to asynchronously load SVG content
  private async updateSvgContent(): Promise<void> {
    const ERROR_SVG = '<svg aria-hidden="true"><text x="0" y="10" fill="red">Icon Not Found</text></svg>';
    try {
      if (!this.name) {
        this.svgContent = ''; // Set empty SVG content if no name
        return;
      }

      const icons = await this.loadIcons();

      if (icons[this.name]) {
        this.svgContent = icons[this.name];
      } else {
        console.error(`Icon "${this.name}" not found in appearance "${this.appearance}".`);
        this.svgContent = ERROR_SVG; // Fallback SVG content
      }
    } catch (error: any) {
      console.log('Inside catch block:', error.message); // Debug
      console.error(`Failed to load icons for appearance "${this.appearance}".`, error);
      this.svgContent = ERROR_SVG;
    }

    // Sanitize the SVG content
    this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(this.svgContent);
    this.changeDetector.markForCheck();
  }

  // Dynamically import the appropriate file based on the icon appearance
  private async loadIcons(): Promise<Record<string, string>> {
    switch (this.appearance) {
      case 'outline':
        return (await import('./icon-store/outline-icons')).OUTLINE_ICONS;
      case 'solid':
        return (await import('./icon-store/solid-icons')).SOLID_ICONS;
      default:
        console.error(`Invalid icon appearance: "${this.appearance}"`);
        throw new Error(`Invalid icon appearance: "${this.appearance}"`); // Log and throw for invalid appearance
    }
  }
}
