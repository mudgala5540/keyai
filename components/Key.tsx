import React, { forwardRef } from 'react';

interface KeyProps {
  value: string;
  originalKey: string;
  onClick: (value: string) => void;
}

const Key = forwardRef<HTMLButtonElement, KeyProps>(({ value, originalKey, onClick }, ref) => {
  const getStyle = () => {
    switch (originalKey) {
      case 'backspace':
      case 'shift':
        return 'w-16 bg-gray-600 flex-grow-0';
      case 'space':
        return 'flex-grow bg-gray-600';
      case 'send':
        return 'w-24 bg-cyan-600 text-white flex-grow-0';
      default:
        return 'w-10 flex-grow-0';
    }
  };
  
  const content = () => {
      if (originalKey === 'backspace') {
          return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
            </svg>
          )
      }
      if (originalKey === 'shift') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        )
      }
      if (originalKey === 'send') {
        return 'Send';
      }
      if (originalKey === 'space') {
        return 'SPACE';
      }
      return value;
  }

  return (
    <button
      ref={ref}
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from bubbling to parent div
        onClick(originalKey)
      }}
      className={`h-12 rounded-md text-white font-semibold flex items-center justify-center
        transition-all duration-75 ease-in-out active:bg-gray-500 active:scale-95 text-lg z-20
        ${originalKey.length === 1 ? 'bg-gray-700 hover:bg-gray-600' : ''}
        ${getStyle()}`}
    >
      {content()}
    </button>
  );
});

export default Key;