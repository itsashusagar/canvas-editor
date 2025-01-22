import { create } from 'zustand';
import { fabric } from 'fabric';

interface CanvasState {
  canvas: fabric.Canvas | null;
  history: string[];
  currentStep: number;
  setCanvas: (canvas: fabric.Canvas) => void;
  addToHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvas: null,
  history: [],
  currentStep: -1,
  
  setCanvas: (canvas) => set({ canvas }),
  
  addToHistory: () => {
    const { canvas, history, currentStep } = get();
    if (!canvas) return;
    
    const json = JSON.stringify(canvas.toJSON());
    const newHistory = [...history.slice(0, currentStep + 1), json];
    
    set({
      history: newHistory,
      currentStep: newHistory.length - 1,
    });
  },
  
  undo: () => {
    const { canvas, history, currentStep } = get();
    if (!canvas || currentStep <= 0) return;
    
    const newStep = currentStep - 1;
    canvas.loadFromJSON(history[newStep], canvas.renderAll.bind(canvas));
    
    set({ currentStep: newStep });
  },
  
  redo: () => {
    const { canvas, history, currentStep } = get();
    if (!canvas || currentStep >= history.length - 1) return;
    
    const newStep = currentStep + 1;
    canvas.loadFromJSON(history[newStep], canvas.renderAll.bind(canvas));
    
    set({ currentStep: newStep });
  },
}));