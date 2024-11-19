# Bookmark Manager

Bookmark Manager is a Chrome extension designed to replace the default home page of your browser, helping you organize, manage, and note everything from a single place.

## Features

### Organize Home Page by Columns

Bookmark Manager divides the home page into columns, each containing elements you use daily:

- **Bookmark**: Save links to frequently visited websites for quick access with a single click.
- **Task**: Store tasks and create to-do lists to manage your time and work efficiently.
- **Note**: Quickly jot down ideas or important information using the Tiptap editor, which supports basic text formatting features.

### Flexible Settings

Bookmark Manager offers various customization options:

- **Open Bookmark**: Customize whether to open bookmarks in a new tab or the current tab, based on your browsing habits.
- **Export & Import Data**: Easily back up and restore your bookmarks, tasks, and notes, ensuring you retain important information even when switching devices.

### Data Security

All your data is stored entirely in the browser's local storage, with no information sent or collected by the extension. Bookmark Manager respects user privacy, protecting personal data and ensuring it remains secure within your browser.

## Benefits of Bookmark Manager

- **Save Time**: Access essential information, favorite websites, tasks, and notes immediately upon opening your browser.
- **Personalization**: Customize your browser's home page to match your style and needs.
- **Privacy Assurance**: No worries about data collection or leaks.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### Installation

Clone the repository:

```bash
git clone https://github.com/minhdevtree/bookmark.git
```

Install dependencies:

```bash
npm install
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building the Project

To build the project for use as a Chrome extension, run:

```bash
npm run build
```

This will create an optimized production build in the `out` directory. Additionally, it will move and modify files as needed to prepare the project for Chrome extension use.

### Using as a Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `out` directory created during the build process.

### Running the Production Server

After building the project, you can serve the production build using:

```bash
npx serve@latest out
```

## Contributing

Bookmark Manager is an open-source project, and contributions are welcome! You can access the source code on GitHub. Here, you will find the complete source code, installation instructions, and detailed usage guides. We welcome ideas, feedback, and contributions from the community to improve and expand the extension's features.
