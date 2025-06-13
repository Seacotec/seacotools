import {ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

// Static cache for icon sets using specific cache keys
class IconCache {
  private static cache = new Map<string, SafeHtml>(); // Store sanitized directly
  private static loadingPromises = new Map<string, Promise<SafeHtml>>();
  private static iconSets = new Map<string, Record<string, string>>();

  static async getSanitizedIcon(appearance: string, iconName: string, sanitizer: DomSanitizer): Promise<SafeHtml> {
    const cacheKey = `${appearance}-${iconName}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    const loadPromise = this.loadAndSanitizeIcon(appearance, iconName, sanitizer);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const sanitizedIcon = await loadPromise;
      this.cache.set(cacheKey, sanitizedIcon);
      this.loadingPromises.delete(cacheKey);
      return sanitizedIcon;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  private static async loadAndSanitizeIcon(appearance: string, iconName: string, sanitizer: DomSanitizer): Promise<SafeHtml> {
    if (!this.iconSets.has(appearance)) {
      const iconSet = await this.loadIconsFromFile(appearance);
      this.iconSets.set(appearance, iconSet);
    }

    const iconSet = this.iconSets.get(appearance)!;
    const icon = iconSet[iconName];

    if (!icon) {
      throw new Error(`Icon "${iconName}" not found in ${appearance} set`);
    }

    return sanitizer.bypassSecurityTrustHtml(icon);
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
    if (!this.name) {
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml('');
      this.changeDetector.markForCheck();
      return;
    }

    try {
      this.safeSvgContent = await IconCache.getSanitizedIcon(this.appearance, this.name, this.sanitizer);
      this.changeDetector.markForCheck(); // Only mark for check on success
    } catch (error) {
      console.error(`Failed to load icon "${this.name}" with appearance "${this.appearance}".`, error);
      const ERROR_SVG = '<svg aria-hidden="true"><text x="0" y="10" fill="red">Icon Not Found</text></svg>';
      this.safeSvgContent = this.sanitizer.bypassSecurityTrustHtml(ERROR_SVG);
      this.changeDetector.markForCheck(); // Mark for check on error too
    }
  }
}
