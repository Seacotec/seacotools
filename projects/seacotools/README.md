⚠️ **Pre-release Version**: This is a testing release and may be unstable or incomplete. Please report any issues you encounter.

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
- **`<sc-dropdown>`**: A simplified wrapper dropdown component for easily selecting values from a list of options.
- **`<sc-checkbox>`**: A basic usage of a checkbox element.
- **`<sc-date-picker>`**: Date picker element.
- **`<sc-table>`**: Reusable table element.

### **Services**
- **`ScHelperService`**: A general-purpose helper service that provides reusable dialog, toast, spinner, and navigation utilities.

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

- `@source "../node_modules/seacotools";`

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

#### `<sc-dropdown>` Component

The `<sc-dropdown>` component is designed as a wrapper around the more feature-rich `sc-dropdown`. It provides a highly customizable and simplified interface for developers who require quick integration with minimal configuration.

**Inputs**:
| **Input**             | **Type**                     | **Required** | **Default**         | **Description**                                                                 |
|-----------------------|------------------------------|--------------|---------------------|---------------------------------------------------------------------------------|
| `options`            | `{ label: string, value: any }[]` | Yes          | `[]`                | The list of options to display in the dropdown. Each option has a `label` and `value`. |
| `placeholder`         | `string`                     | No           | `'Select option'`   | The placeholder text displayed on the button when no option is selected.        |
| `changePlaceholderOnSelect` | `boolean`              | No           | `false`             | Whether to replace the placeholder with the selected option's label.            |
| `buttonClasses`       | `string`                     | No           | `''`                | Custom CSS classes for the dropdown button (e.g., colors, sizes).               |
| `optionClasses`       | `string`                     | No           | `''`                | Custom CSS classes for the options list (e.g., hover states, padding).          |
| `buttonType`          | `string`                     | No           | `'button'`          | Defines the button's type attribute.                                            |
| `optionsWidthClass`   | `string`                     | No           | `'w-44'`            | Defines the width of the dropdown menu (via Tailwind CSS classes).              |

**Outputs**:
| **Output**            | **Type**         | **Description**                                                             |
|-----------------------|------------------|-----------------------------------------------------------------------------|
| `selectionChange`     | `EventEmitter<any>` | Emits the value of the option selected by the user.                         |

---

## Custom Icon Sets

The `<sc-icon>` component allows you to extend the default library by adding custom icons.

1. Define a custom icon set in a separate file:

2. Import and register the icon set in your module or component:

---
## Custom Table

The `<sc-table>` component is a highly customizable reusable table component that supports features like sorting, pagination, and styling.
**Inputs**: | **Input** | **Type** | **Required** | **Default** | **Description** | |---------------|---------------------|--------------|-------------------------|---------------------------------------------------------------------------------| | `columns` | | Yes | `[]` | Defines the columns of the table with properties like `label`, `field`, `sortable`, etc. | | `data` | | Yes | `[]` | The data array to populate the table rows. Each item in the array represents a row. | | `pageSize` | `number` | No | `10` | Number of rows per page. Set to `0` to disable pagination and show all rows. | | `config` | `TableConfig` | No | `{}` | Provides additional configuration for table styling like `headerClass`, `rowClass`, etc. | `TableColumn[]``any[]`
**Outputs**: Currently, no event emitters are implemented.
**Features**:
- **Sorting**: Add sorting functionality to columns using the `sortable` property in `columns`.
- **Pagination**: Automatically paginates data based on the `pageSize` input.
- **Custom Templates**: Allows you to define custom templates for columns by providing a `template`.


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

## Deployment

- cd dist/seacotools/
- npm publish --tag beta
  npm dist-tag add seacotools@1.0.21-beta.0 latest

---

## License

This library is open-source and distributed under the MIT License. See the `LICENSE` file for details.

---
