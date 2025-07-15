
# Dynamic Odds Table (React + Vite)

This project displays dynamic odds tables for sports matches using React and Vite. Data is loaded from local JSON files and displayed with a modern UI.

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open your browser and go to the local address shown in the terminal (usually http://localhost:5173).

### Project Structure

- `src/App.jsx` - Main React component
- `src/data1.json`, `src/data2.json` - Example data files
- `src/index.css` - Styles (uses Tailwind CSS utility classes)

### Features

- Search for matches by ID or team name
- View match info and countdown timer
- Expand/collapse odds tables by type
- Responsive and modern UI

### Tailwind CSS Setup

Tailwind CSS is already configured. If you need to re-install:

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Make sure your `src/index.css` includes:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Customization

- To use different data, replace or edit `src/data1.json` or `src/data2.json`.
- To change the UI, edit `src/App.jsx` and related components.

## License

MIT
