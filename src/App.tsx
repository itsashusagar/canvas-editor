import React from 'react';
import ImageSearch from './components/ImageSearch/ImageSearch';
import CanvasEditor from './components/Canvas/CanvasEditor';
import { useImageStore } from './store/imageStore';

function App() {
  const { selectedImage } = useImageStore();

  return (
    <div className="min-h-screen bg-gray-100">
      {!selectedImage ? (
        <ImageSearch />
      ) : (
        <CanvasEditor />
      )}
    </div>
  );
}

export default App;