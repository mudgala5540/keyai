import React, { useState, useRef, useEffect, useCallback } from 'react';
import Key from './Key';
import { findBestWord } from '../dictionary';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}

const keyLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const [isShifted, setIsShifted] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipePathRef = useRef<{ x: number; y: number }[]>([]);
  const swipeKeysRef = useRef<string[]>([]);

  const keyRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const keyboardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getRelativeCoords = (e: React.PointerEvent) => {
    const rect = keyboardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  
  const drawSwipeTrail = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (swipePathRef.current.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(swipePathRef.current[0].x, swipePathRef.current[0].y);
    for (let i = 1; i < swipePathRef.current.length; i++) {
      ctx.lineTo(swipePathRef.current[i].x, swipePathRef.current[i].y);
    }
    ctx.strokeStyle = '#06b6d4'; // cyan-500
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsSwiping(true);
    swipePathRef.current = [getRelativeCoords(e)];
    swipeKeysRef.current = [];
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSwiping) return;
    
    const coords = getRelativeCoords(e);
    swipePathRef.current.push(coords);
    drawSwipeTrail();

    for (const [key, ref] of keyRefs.current.entries()) {
        const rect = ref?.getBoundingClientRect();
        if (ref && rect) {
            const keyboardRect = keyboardRef.current!.getBoundingClientRect();
            if (
                e.clientX > rect.left && e.clientX < rect.right &&
                e.clientY > rect.top && e.clientY < rect.bottom
            ) {
                const lastKey = swipeKeysRef.current[swipeKeysRef.current.length - 1];
                if (key.length === 1 && key !== lastKey) {
                    swipeKeysRef.current.push(key);
                }
            }
        }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isSwiping) return;
    setIsSwiping(false);
    
    // Check if it was a swipe or a click
    const isSwipe = swipePathRef.current.length > 3 && swipeKeysRef.current.length > 1;

    if (isSwipe) {
        const word = findBestWord(swipeKeysRef.current.join(''));
        if (word) {
            const finalWord = isShifted ? word.charAt(0).toUpperCase() + word.slice(1) : word;
            onKeyPress(finalWord + ' ');
        }
    }
    
    // Clear trail
    swipePathRef.current = [];
    drawSwipeTrail();
    if (isShifted) setIsShifted(false);
    
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  
  const handleKeyClick = (key: string) => {
     // This handles clicks when swipe gesture is not made
    if (swipePathRef.current.length <= 3) {
      if (key === 'shift') {
        setIsShifted(!isShifted);
        return;
      }
      const keyValue = isShifted ? key.toUpperCase() : key.toLowerCase();
      onKeyPress(keyValue);
      if (isShifted) setIsShifted(false);
    }
  };

  useEffect(() => {
    const keyboardEl = keyboardRef.current;
    const canvas = canvasRef.current;
    if (!keyboardEl || !canvas) return;
  
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = keyboardEl.offsetWidth;
      canvas.height = keyboardEl.offsetHeight;
    });
  
    resizeObserver.observe(keyboardEl);
  
    return () => resizeObserver.unobserve(keyboardEl);
  }, []);
  
  return (
    <div 
        className="w-full max-w-2xl bg-gray-800/80 p-2 rounded-xl relative touch-none"
        ref={keyboardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
    >
       <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />
      <div className="space-y-2">
        {keyLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const displayKey = isShifted && key.length === 1 ? key.toUpperCase() : key;
              return (
                <Key
                  // Fix: Ensure ref callback does not return a value.
                  // The `Map.set` method returns the map, which was causing a type error.
                  // Wrapping the call in a block `{}` fixes this.
                  ref={(el) => { keyRefs.current.set(key, el); }}
                  key={key}
                  value={displayKey}
                  originalKey={key}
                  onClick={handleKeyClick}
                />
              );
            })}
          </div>
        ))}
        <div className="flex justify-center gap-1.5">
            {/* Fix: Ensure ref callback does not return a value by wrapping it in a block. */}
            <Key ref={(el) => { keyRefs.current.set('space', el); }} value="space" originalKey="space" onClick={handleKeyClick} />
            {/* Fix: Ensure ref callback does not return a value by wrapping it in a block. */}
            <Key ref={(el) => { keyRefs.current.set('send', el); }} value="send" originalKey="send" onClick={handleKeyClick} />
        </div>
      </div>
    </div>
  );
};

export default Keyboard;