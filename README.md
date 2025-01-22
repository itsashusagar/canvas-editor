# Image Editor with Unsplash Integration

A modern, responsive web application that allows users to search for images from Unsplash, add custom captions and shapes, and download the modified images.

## Features

- 🖼️ Image Search via Unsplash API
- ✏️ Text and Shape Overlays
- 🎨 Color Customization
- 📱 Fully Responsive Design
- ↩️ Undo/Redo Support
- 💾 Image Download
- 🎯 Drag & Drop Interface

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Fabric.js
- React Query
- Zustand
- Lucide React Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd image-editor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Unsplash API key:
```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

4. Start the development server:
```bash
npm run dev
```

### Environment Variables

The following environment variables are required:

- `VITE_UNSPLASH_ACCESS_KEY`: Your Unsplash API access key

### Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

1. **Search Images**: Enter keywords in the search bar to find images from Unsplash
2. **Edit Image**: Click "Add Captions" on any image to enter the editor
3. **Add Elements**:
   - Text: Click the text icon to add editable text
   - Shapes: Use the shape tools to add various shapes
   - Colors: Use the color pickers to customize fill and stroke colors
4. **Modify Elements**:
   - Drag to reposition
   - Use corners to resize/rotate
   - Double-click text to edit
5. **Save Work**:
   - Use undo/redo for corrections
   - Click Download to save your edited image

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Unsplash](https://unsplash.com) for providing the image API
- [Fabric.js](http://fabricjs.com) for the canvas manipulation library
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework