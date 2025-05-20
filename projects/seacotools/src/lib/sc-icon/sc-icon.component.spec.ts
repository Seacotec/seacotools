import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ScIconComponent} from './sc-icon.component';

describe('HeroForgeIconComponent', () => {
  let component: ScIconComponent;
  let fixture: ComponentFixture<ScIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScIconComponent],  // Import the standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ScIconComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the correct icon for valid name and appearance inputs', async () => {
    const mockOutlineIcons = {
      'academic-cap': '<svg>Mock Outline Academic Cap</svg>',
    };

    // Mock the dynamic import
    spyOn(component as any, 'loadIcons').and.returnValue(Promise.resolve(mockOutlineIcons));

    // Set inputs
    fixture.componentRef.setInput('name', 'academic-cap');
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();

    // Trigger lifecycle methods manually
    await component['updateSvgContent']();

    // Test that the SVG content was updated correctly
    expect(component.svgContent).toEqual('<svg>Mock Outline Academic Cap</svg>');
  });

  it('should handle invalid icon name gracefully', async () => {
    const mockOutlineIcons = {
      'academic-cap': '<svg>Mock Outline Academic Cap</svg>',
    };

    // Mock the dynamic import
    spyOn(component as any, 'loadIcons').and.returnValue(Promise.resolve(mockOutlineIcons));

    // Set inputs with an invalid name
    fixture.componentRef.setInput('name', 'invalid-icon-name');
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();

    // Trigger lifecycle methods manually
    await component['updateSvgContent']();

    // Fallback SVG content
    const fallbackSVG = '<svg aria-hidden="true"><text x="0" y="10" fill="red">Icon Not Found</text></svg>';
    expect(component.svgContent).toEqual(fallbackSVG);
  });

  it('should set an empty SVG content when no name is provided', async () => {
    // Set inputs with no name
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();

    // Trigger lifecycle methods manually
    await component['updateSvgContent']();

    // Check that SVG content is empty
    expect(component.svgContent).toEqual('');
  });

  it('should handle loadIcons failure gracefully', async () => {
    // Mock dynamic import to throw an error
    spyOn(component as any, 'loadIcons').and.returnValue(
      Promise.reject(new Error('Dynamic import failed'))
    );

    // Set valid inputs
    fixture.componentRef.setInput('name', 'academic-cap');
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();

    // Spy on console.error
    spyOn(console, 'error');

    // Trigger updateSvgContent
    await component['updateSvgContent']();

    // Fallback SVG content
    const fallbackSVG = '<svg aria-hidden="true"><text x="0" y="10" fill="red">Icon Not Found</text></svg>';
    expect(component.svgContent).toEqual(fallbackSVG);

    // Check that error was logged
    expect(console.error).toHaveBeenCalledWith(
      'Failed to load sc-icon for appearance "outline".',
      jasmine.any(Error)
    );
  });

  it('should load the correct icon when appearance is solid', async () => {
    const mockSolidIcons = {
      'academic-cap': '<svg>Mock Solid Academic Cap</svg>',
    };

    spyOn(component as any, 'loadIcons').and.returnValue(Promise.resolve(mockSolidIcons));

    fixture.componentRef.setInput('name', 'academic-cap');
    fixture.componentRef.setInput('appearance', 'solid');
    fixture.detectChanges();

    await component['updateSvgContent']();

    expect(component.svgContent).toEqual('<svg>Mock Solid Academic Cap</svg>');
  });

  it('should update the content when inputs change dynamically', async () => {
    const mockOutlineIcons = { 'academic-cap': '<svg>Mock Outline Academic Cap</svg>' };
    const mockSolidIcons = { 'academic-cap': '<svg>Mock Solid Academic Cap</svg>' };

    // Mock loadIcons dynamically based on the appearance
    spyOn(component as any, 'loadIcons').and.callFake(async () => {
      if (component.appearance === 'outline') {
        return mockOutlineIcons;
      } else if (component.appearance === 'solid') {
        return mockSolidIcons;
      } else {
        return {};
      }
    });

    // Set initial inputs
    fixture.componentRef.setInput('name', 'academic-cap');
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();

    // Trigger initial update
    await component['updateSvgContent']();

    // Expect first content (outline appearance)
    expect(component.svgContent).toEqual('<svg>Mock Outline Academic Cap</svg>');

    // Change appearance dynamically to solid
    fixture.componentRef.setInput('appearance', 'solid');
    fixture.detectChanges();

    // Trigger update for the changed appearance
    await component['updateSvgContent']();

    // Expect new content (solid appearance)
    expect(component.svgContent).toEqual('<svg>Mock Solid Academic Cap</svg>');
  });
});
