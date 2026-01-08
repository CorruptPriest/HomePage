
# Prostmitwein's Start Page
![Prostmitwein's Start Page](asset1.png)

A nothing themed, developer-focused start page that behaves like a code editor and terminal.

## Features

- **Editor View**: Displays time, date, and bookmarks as code.
- **Terminal**: Fully functional command line for navigation and tools.
- **Notes**: Built-in note-taking with persistence.
- **Physics Mode**: Turn the UI into a playground with gravity.
- **Theming**: Custom accents, light/dark modes, and visual effects (dots, glaze, tint).

## Usage

### Navigation
- **Bookmarks**: Type the name of a bookmark in the terminal (e.g., `reddit`, `github`) and hit Enter.
- **Search**: Type any query (e.g., `react docs`) in the terminal. You will be asked to select an engine:
  - `[G]` Google
  - `[D]` DuckDuckGo
  - `[M]` Gemini
  - `[A]` AI Overview
  - `[Y]` YouTube
  - `[S]` Songs (YouTube Music)

### Commands
| Command | Description |
|---------|-------------|
| `help` | Show available commands. |
| `clear` | Clear the terminal output. |
| `reset` | Reload the page. |
| `gravity` | Enable physics mode (chaos). |
| `note [text]` | Create a new note. |
| `note -ID [text]` | Edit an existing note (e.g., `note -1234 Buy milk`). |
| `note -ID -delete` | Delete a note. |

### Shortcuts
- **Clicking a Note**: Opens the note in a detailed modal view.
- **Settings**: Click the gear icon in the sidebar to toggle themes and effects.
- **Focus**: The terminal input auto-focuses when you type (unless you're selecting text).

## Installation
1. Clone the repo.
2. Open `index.html` in your browser.
3. (Optional) Set as your browser's new tab page.

## Customization
- **Bookmarks**: Edit the `links` object in `script.js`.
- **Styles**: Modify CSS variables in `style.css`.
