import React, { useState, useRef, useEffect } from 'react';
import Key from './Key';
import { findBestWord } from '../dictionary';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

type Layout = 'letters' | 'symbols';
type ShiftMode = 'off' | 'once' | 'caps';

const lowerCaseLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
  ['?123', 'space', 'send'],
];

const upperCaseLayout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'backspace'],
  ['?123', 'space', 'send'],
];

const symbolsLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '_', '&', '-', '+', '(', ')', '/'],
  ['=', '*', '"', "'", ':', ';', '!', '?', 'backspace'],
  ['ABC', 'space', '.'],
];


const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const [layout, setLayout] = useState<Layout>('letters');
  const [shiftMode, setShiftMode] = useState<ShiftMode>('off');
  
  const gestureStateRef = useRef({
    isDown: false,
    isSwipe: false,
    path: '',
    startTime: 0,
  });

  const lastShiftTapRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When switching to symbols, turn off shift/caps.
    if (layout === 'symbols') {
      setShiftMode('off');
    }
  }, [layout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const getCoords = (e: React.PointerEvent<HTMLDivElement>): [number, number] | null => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const key = target.closest('[data-key]')?.getAttribute('data-key');
    
    if (key) {
      gestureStateRef.current = {
        isDown: true,
        isSwipe: false,
        path: key,
        startTime: Date.now(),
      };
      
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const coords = getCoords(e);
      if (ctx && coords && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'var(--accent-primary)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(coords[0], coords[1]);
      }
    }
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gestureStateRef.current.isDown) return;
    
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const key = element?.closest('[data-key]')?.getAttribute('data-key');
    
    if (key && key.length === 1 && gestureStateRef.current.path[gestureStateRef.current.path.length - 1] !== key) {
      gestureStateRef.current.path += key;
      if ([...new Set(gestureStateRef.current.path)].length > 1) {
        gestureStateRef.current.isSwipe = true;
      }
    }

    const ctx = canvasRef.current?.getContext('2d');
    const coords = getCoords(e);
    if(ctx && coords) {
        ctx.lineTo(coords[0], coords[1]);
        ctx.stroke();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gestureStateRef.current.isDown) return;

    const { path, isSwipe } = gestureStateRef.current;
    
    if (isSwipe) {
        const word = findBestWord(path);
        if (word) {
          onKeyPress(word);
        }
    } else {
        handleKeyClick(path);
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    gestureStateRef.current = {
      isDown: false,
      isSwipe: false,
      path: '',
      startTime: 0,
    };
  };
  
  const handleKeyClick = (key: string) => {
    switch (key) {
      case 'shift':
        const now = Date.now();
        if (now - lastShiftTapRef.current < 300) { 
          setShiftMode(prev => prev === 'caps' ? 'off' : 'caps');
        } else {
          setShiftMode(prev => prev === 'off' ? 'once' : 'off');
        }
        lastShiftTapRef.current = now;
        break;
      case '?123':
        setLayout('symbols');
        break;
      case 'ABC':
        setLayout('letters');
        break;
      case 'backspace':
      case 'space':
      case 'send':
      case '.':
        onKeyPress(key);
        break;
      default:
        onKeyPress(key);
        if (shiftMode === 'once') {
          setShiftMode('off');
        }
        break;
    }
  };
  
  const currentLayout = layout === 'letters' 
    ? (shiftMode !== 'off' ? upperCaseLayout : lowerCaseLayout) 
    : symbolsLayout;

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-1.5 p-2 bg-[var(--bg-secondary)] select-none touch-none relative"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
      {currentLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center w-full">
            {rowIndex === 1 && layout === 'letters' && <div className="w-2 md:w-4 flex-shrink" />}
            {row.map((keyVal) => (
                <Key
                  key={keyVal}
                  value={keyVal}
                  isShiftActive={shiftMode === 'once'}
                  isCapsLock={shiftMode === 'caps'}
                />
            ))}
             {rowIndex === 1 && layout === 'letters' && <div className="w-2 md:w-4 flex-shrink" />}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;