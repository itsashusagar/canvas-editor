import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { fabric } from 'fabric';
import {
  Type,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Hexagon,
  Palette,
  Download,
  Undo,
  Redo,
} from 'lucide-react';

interface ToolBarProps {
  onClose?: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ onClose }) => {
  const { canvas, addToHistory, undo, redo } = useCanvasStore();

  const handleAction = (action: () => void) => {
    action();
    // Close toolbar on mobile after action
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    addToHistory();
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle' | 'polygon') => {
    if (!canvas) return;
    
    let shape;
    const commonProps = {
      left: 100,
      top: 100,
      fill: '#e2e8f0',
      stroke: '#64748b',
      strokeWidth: 2,
      width: 100,
      height: 100,
    };

    switch (type) {
      case 'rect':
        shape = new fabric.Rect(commonProps);
        break;
      case 'circle':
        shape = new fabric.Circle({
          ...commonProps,
          radius: 50,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle(commonProps);
        break;
      case 'polygon':
        shape = new fabric.Polygon([
          { x: 50, y: 0 },
          { x: 100, y: 25 },
          { x: 100, y: 75 },
          { x: 50, y: 100 },
          { x: 0, y: 75 },
          { x: 0, y: 25 },
        ], {
          ...commonProps,
          left: 100,
          top: 100,
        });
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      addToHistory();
    }
  };

  const handleColorChange = (type: 'fill' | 'stroke', color: string) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    if (type === 'fill') {
      activeObject.set('fill', color);
    } else {
      activeObject.set('stroke', color);
    }
    
    canvas.renderAll();
    addToHistory();
  };

  const handleDownload = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const originalStates = objects.map(obj => ({
      selectable: obj.selectable,
      evented: obj.evented
    }));

    objects.forEach(obj => {
      obj.set({
        selectable: false,
        evented: false
      });
    });

    canvas.discardActiveObject();
    canvas.renderAll();

    try {
      const canvasElement = canvas.getElement();
      const context = canvasElement.getContext('2d');
      
      if (!context) return;

      const dataUrl = canvasElement.toDataURL({
        format: 'png',
        quality: 1,
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `edited-image-${timestamp}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      objects.forEach((obj, index) => {
        obj.set({
          selectable: originalStates[index].selectable,
          evented: originalStates[index].evented
        });
      });
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Elements</h2>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={() => handleAction(undo)}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Undo"
            >
              <Undo className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Undo</span>
            </button>
            <button
              onClick={() => handleAction(redo)}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Redo"
            >
              <Redo className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Redo</span>
            </button>
            <button
              onClick={() => handleAction(addText)}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Add Text"
            >
              <Type className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Text</span>
            </button>
            <button
              onClick={() => handleAction(() => addShape('rect'))}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Add Rectangle"
            >
              <Square className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Rectangle</span>
            </button>
            <button
              onClick={() => handleAction(() => addShape('circle'))}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Add Circle"
            >
              <CircleIcon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Circle</span>
            </button>
            <button
              onClick={() => handleAction(() => addShape('triangle'))}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Add Triangle"
            >
              <TriangleIcon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Triangle</span>
            </button>
            <button
              onClick={() => handleAction(() => addShape('polygon'))}
              className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              title="Add Polygon"
            >
              <Hexagon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm text-gray-600">Hexagon</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2" title="Fill Color">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm text-gray-600">Fill Color</span>
              </div>
              <input
                type="color"
                onChange={(e) => handleColorChange('fill', e.target.value)}
                className="w-full h-8 cursor-pointer rounded"
              />
            </div>
            <div className="space-y-2" title="Stroke Color">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current" />
                <span className="text-xs md:text-sm text-gray-600">Stroke</span>
              </div>
              <input
                type="color"
                onChange={(e) => handleColorChange('stroke', e.target.value)}
                className="w-full h-8 cursor-pointer rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => handleAction(handleDownload)}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Download className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Download Image</span>
        </button>
      </div>
    </div>
  );
};

export default ToolBar;