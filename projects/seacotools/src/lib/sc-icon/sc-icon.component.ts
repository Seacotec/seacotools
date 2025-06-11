import {ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

// Static cache for icon sets using specific cache keys
class IconCache {
  private static cache = new Map<string, Record<string, string>>();
  private static loadingPromises = new Map<string, Promise<Record<string, string>>>();

  static async getIcons(cacheKey: string): Promise<Record<string, string>> {
    const appearance = cacheKey.split('-')[0]; // Extract appearance from cacheKey

    if (this.cache.has(appearance)) {
      return this.cache.get(appearance)!;
    }

    if (this.loadingPromises.has(appearance)) {
      return this.loadingPromises.get(appearance)!;
    }

    const loadPromise = this.loadIconsFromFile(appearance);
    this.loadingPromises.set(appearance, loadPromise);

    try {
      const icons = await loadPromise;
      this.cache.set(appearance, icons);
      this.loadingPromises.delete(appearance);
      return icons;
    } catch (error) {
      this.loadingPromises.delete(appearance);
      throw error;
    }
  }

  private static async loadIconsFromFile(appearance: string): Promise<Record<string, string>> {
    switch (appearance) {
      case 'outline':
        return (await import('./icon-store/outline-icons')).OUTLINE_ICONS;
      case 'solid':
        return (await import('./icon-store/solid-icons')).SOLID_ICONS;
      default:
        throw new Error(`Invalid icon appearance: "${appearance}"`);
    }
  }
}

@Component({
  selector: 'sc-icon',
  template: `
    <svg
      [innerHTML]="safeSvgContent"
      [attr.class]="computedClass">
    </svg>
  `,
})
export class ScIconComponent implements OnChanges {
  private sanitizer = inject(DomSanitizer);
  private changeDetector = inject(ChangeDetectorRef);

  @Input({required: true}) name: string = '';
  @Input() appearance: 'outline' | 'solid' = 'outline';
  @Input() class: string = '';

  safeSvgContent: SafeHtml = '';
  computedClass: string = '';

  // Cache for sanitized SVG content using specific icon keys
  private static sanitizedCache = new Map<string, SafeHtml>();

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['class']) {
      this.computedClass = this.processClasses(this.class);
    }

    if (changes['name'] || changes['appearance']) {
      await this.updateSvgContent();
    }
  }

  private processClasses(inputClass: string): string {
    const hasWidth = inputClass.match(/w-\d+/);
    const hasHeight = inputClass.match(/h-\d+/);

    let updatedClass = inputClass;

    if (hasWidth && !hasHeight) {
      const widthValue = hasWidth[0].split('-')[1];
      updatedClass += ` h-${widthValue}`;
    } else if (hasHeight && !hasWidth) {
      const heightValue = hasHeight[0].split('-')[1];
      updatedClass += ` w-${heightValue}`;
    } else if (!hasWidth && !hasHeight) {
      updatedClass += ' w-5 h-5';
    }

    return updatedClass.trim();
  }

  private async updateSvgContent(): Promise<void> {
    const ERROR_SVG = '<svg aria-hidden="true"><text x="0" y="10" fill="red">Icon Not Found</text></svg>';

    if (!this.name) {
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml('');
      return;
    }

    // Use the specific cacheKey that includes both appearance and name
    const cacheKey = `${this.appearance}-${this.name}`;

    // Check if we already have the sanitized version cached
    if (ScIconComponent.sanitizedCache.has(cacheKey)) {
      this.safeSvgContent = ScIconComponent.sanitizedCache.get(cacheKey)!;
      return;
    }

    try {
      // Pass the cacheKey to IconCache.getIcons
      const icons = await IconCache.getIcons(cacheKey);
      const svgContent = icons[this.name] || ERROR_SVG;

      // Sanitize and cache using the specific cacheKey
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(svgContent);
      ScIconComponent.sanitizedCache.set(cacheKey, this.safeSvgContent);

    } catch (error) {
      console.error(`Failed to load icons for appearance "${this.appearance}".`, error);
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(ERROR_SVG);
    }

    this.changeDetector.markForCheck();
  }
}
