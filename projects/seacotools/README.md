⚠️ **Pre-release Version**: This is a testing release (`v0.0.1-alpha.0`) and may be unstable or incomplete. Please report any issues you encounter.

# SeacoTools Library

**SeacoTools** is an Angular library that provides a collection of reusable UI components and services. The library is built for modern Angular applications, improving development efficiency and maintainability.

---
## Installation

Install the **SeacoTools** library in your Angular project.

- **npm**: `npm install seacotools`
- **yarn**: `yarn add seacotools`
- **pnpm**: `pnpm add seacotools`

## Components & Services

The library includes the following reusable components and services:

### **Components**
- **`<sc-icon>`**: A customizable SVG icon component for rendering icons dynamically with support for custom styles and sizes.
- **`<sc-button>`**: A reusable button component with flexible styling, multiple appearances, and size options.
- **`<sc-select>`**: A dynamic select dropdown component for choosing values from customizable options.
- **`<sc-input>`**: A flexible input field with support for various input types, validation, and styling.

### **Services**
- **`SeacotoolsHelperService`**: A general-purpose helper service that provides reusable dialog, toast, spinner, and navigation utilities.

---

## Features

- **Compatibility with Angular 19+**: Fully compatible with the latest versions of Angular (19 or later).
- **Tailwind CSS Compatible**: Customizable styling options using Tailwind CSS for dynamic layouts and designs.
- **Efficient & Lightweight**: Designed for minimal bundle sizes using Angular lazy loading and modern build practices.
- **Reactive Forms Integration**: Fully reactive components that integrate seamlessly with Angular's Forms API.
- **Reusable Utility Functions**: Predefined services for handling UI interactions, toast notifications, and navigation.

---

## Installation

Install the **SeacoTools** library in your Angular project:

## Usage Instructions

### Peer Dependencies

Ensure the following **peer dependencies** are installed in your project:

- Angular 19+ (`@angular/core`, `@angular/common`)
- `rxjs` (7.8.0 or higher)
- `@ngneat/dialog` (for dialogs)
- Tailwind CSS, ngx-spinner, and other styling-related tools.

## Basic Usage

### Step 1: Import the `SeacoToolsModule`

Add the `SeacoToolsModule` to your application or feature module:

### Step 2: Configure TailwindCSS for Your Application

Since **SeacoTools** uses TailwindCSS as a peer dependency, you need to ensure that your project is properly configured to include the required Tailwind styles. Add the Tailwind source styles to your application's primary stylesheet file.

### Step 3: Update Your `styles.css` file

Make sure you specify the paths for the library in your `styles.css`:

- `@source "./node_modules/your-library/**/*.{html,js,ts}"`

### Step 4: Use the Components in Templates

#### `<sc-icon>` Component

The `<sc-icon>` component is used to render customizable SVG icons. Customize the `name`, `appearance`, and additional `class` properties to get the desired icon style.


**Inputs**:
| **Input**     | **Type**                       | **Required** | **Description**                                                                 |
|---------------|--------------------------------|--------------|---------------------------------------------------------------------------------|
| `name`        | `string`                      | Yes          | The name of the icon (e.g., `'home'`, `'user'`).                                |
| `appearance`  | `'outline' | 'solid'`         | No           | Icon style (outline or solid). Defaults to `'outline'`.                        |
| `class`       | `string`                      | No           | Tailwind or CSS classes for size, color, etc. Default sizes are `w-5 h-5`.     |

#### `<sc-button>` Component

The `<sc-button>` component provides customizable buttons styled to work seamlessly with existing styles or Tailwind CSS. Example usage:


---

## Custom Icon Sets

The `<sc-icon>` component allows you to extend the default library by adding custom icons.

1. Define a custom icon set in a separate file:

2. Import and register the icon set in your module or component:

---

## Testing & Development

### Build the Library

Run the following command to build the library:

The compiled output will be in the `dist/seacotools` folder.

---

## Roadmap

Planned features for future releases:

- New Material Design icon support.
- Enhanced button variants with animations and states.
- Advanced utility services for state management and API handling.

---

## License

This library is open-source and distributed under the MIT License. See the `LICENSE` file for details.

---
