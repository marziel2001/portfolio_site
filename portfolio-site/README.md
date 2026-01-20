# Portfolio Website

Photography portfolio website built with React, TypeScript, and Vite. Features a category-based photo gallery with thumbnails and lightbox viewer.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Running the Development Server

To start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Photo Gallery Setup

### Directory Structure

Organize your photos in category folders:

```
public/staticImages/
├── fullRes/
│   ├── krajobraz/
│   ├── miasta/
│   └── motoryzacja/
└── thumbnails/
    ├── krajobraz/
    ├── miasta/
    └── motoryzacja/
```

### Generating Thumbnails and Gallery JSON

1. Place your full-resolution images in category folders under `public/staticImages/fullRes/`
2. Run the thumbnail generator:

```bash
node thumbnail-gen.js
```

This script will:
- Generate 800px-wide thumbnails for all images
- Create LQIP (Low Quality Image Placeholders) for smooth loading
- Generate `gallery.json` with all image metadata
- Organize thumbnails in corresponding category folders

### Thumbnail Configuration

To change thumbnail size, edit the `thumbSize` constant in `thumbnail-gen.js`:

```javascript
const thumbSize = 800; // Change to desired width in pixels
```

## Project Structure

- `/src/components` - Reusable React components
- `/src/pages` - Page components
- `/src/types` - TypeScript type definitions
- `/public/staticImages` - Photo gallery images and metadata
- `thumbnail-gen.js` - Image processing utility

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Photo Album
- Yet Another React Lightbox
- Sharp (image processing)

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
