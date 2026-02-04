# Inspirationist

A "napkin-note" style Chrome extension that delivers sparks of inspiration from a remote database directly to your browser.

## ✨ Core Features

- **Napkin UI Design**: Features a realistic paper napkin background using 9-slice scaling technology for perfect responsiveness.
- **Handwritten Typography**: Built-in curated fonts (*Indie Flower*, *Gloria Hallelujah*) to create an authentic "scribbled note" feel.
- **Deep Customization**: Adjust font style, size, bold weight, and toggle functionality via the Side Panel.
- **Smart Interactions**:
  - Click text for the next inspiration; click the background to reveal controls.
  - Smart history tracking (Session-based) to prevent duplicate quotes.
  - Built-in loading states and timeout handling for reliable performance.
- **Convenient Tools**: One-click copy to clipboard and history backtracking.

## 🛠️ Installation & Development

1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the project folder.

## ⚙️ Side Panel Settings

Right-click the extension icon -> Select **"Open side panel"** to:
- Enable/Disable the popup globally.
- Switch between different handwritten font styles.
- Adjust font size (Small, Medium, Large, Extra Large).
- Toggle Bold text for better readability.

## 📦 Backend (Supabase)

Content is hosted on a remote Supabase instance.
- **Manual Entry**: Insert rows into the `inspirations` table via the Supabase Table Editor.
- **Bulk Import**: Use the provided `import_data.csv` to upload batches of data.
- **Schema**: Refer to `setup_supabase.sql` for the database structure.

## 📜 License
MIT License
