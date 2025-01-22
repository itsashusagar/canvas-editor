import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useCanvasStore } from '../../store/canvasStore';
import { useImageStore } from '../../store/imageStore';
import ToolBar from './ToolBar';
import { ArrowLeft, Menu, X } from 'lucide-react';

const CanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvas, setCanvas, addToHistory } = useCanvasStore();
  const { selectedImage, setSelectedImage } = useImageStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  // Calculate container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width - 32,
          height: height - 32,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current || !selectedImage || dimensions.width === 0) return;

    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = fabricCanvas;
    
    fabric.Image.fromURL(selectedImage, 
      (img) => {
        if (!fabricCanvas) return;

        const scale = Math.min(
          (fabricCanvas.width! * 0.8) / img.width!,
          (fabricCanvas.height! * 0.8) / img.height!
        );
        
        img.scale(scale);
        img.set({
          left: (fabricCanvas.width! - img.width! * scale) / 2,
          top: (fabricCanvas.height! - img.height! * scale) / 2,
          selectable: false,
          evented: false,
        });
        
        fabricCanvas.add(img);
        fabricCanvas.sendToBack(img);
        fabricCanvas.renderAll();
        addToHistory();
      },
      { crossOrigin: 'anonymous' }
    );
    
    fabricCanvas.on('object:modified', () => {
      addToHistory();
    });
    
    setCanvas(fabricCanvas);
    
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      const newWidth = width - 32;
      const newHeight = height - 32;
      
      fabricCanvas.setDimensions({
        width: newWidth,
        height: newHeight,
      });

      const scaleX = newWidth / dimensions.width;
      const scaleY = newHeight / dimensions.height;
      
      fabricCanvas.getObjects().forEach((obj) => {
        obj.set({
          left: obj.left! * scaleX,
          top: obj.top! * scaleY,
          scaleX: obj.scaleX! * scaleX,
          scaleY: obj.scaleY! * scaleY,
        });
        obj.setCoords();
      });

      fabricCanvas.renderAll();
      setDimensions({ width: newWidth, height: newHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (fabricCanvas) {
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [selectedImage, dimensions.width]);

  const toggleToolbar = () => {
    setIsToolbarOpen(!isToolbarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="p-2 rounded-lg hover:bg-gray-50"
            title="Back to Search"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Image Editor</h1>
        </div>
        <button
          onClick={toggleToolbar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-50"
          title={isToolbarOpen ? "Close Toolbar" : "Open Toolbar"}
        >
          {isToolbarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 p-4 overflow-hidden">
          <div className="w-full h-full bg-white rounded-lg shadow-lg p-4">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Right Sidebar - Mobile Overlay */}
        <div className={`
          fixed md:relative right-0 top-[73px] md:top-0 h-[calc(100vh-73px)] md:h-auto
          w-[280px] bg-white border-l border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isToolbarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          z-50 md:z-auto
        `}>
          <ToolBar onClose={() => setIsToolbarOpen(false)} />
        </div>
      </div>
    </div>
  );
}

export default CanvasEditor;