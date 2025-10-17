import React from 'react';

interface KeyProps {
  value: string;
  isShiftActive?: boolean;
  isCapsLock?: boolean;
}

const ShiftIcon: React.FC<{ active: boolean, caps: boolean }> = ({ active, caps }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        {caps && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14" />}
    </svg>
);

const BackspaceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-4-4m0 0l4-4m-4 4h12a2 2 0 012 2v4a2 2 0 01-2 2H8" />
    </svg>
);


const Key: React.FC<KeyProps> = ({ value, isShiftActive, isCapsLock }) => {
  const isSpecialKey = value.length > 1;
  
  let displayContent: React.ReactNode = value;
  switch (value) {
    case 'shift':
      displayContent = <ShiftIcon active={isShiftActive || false} caps={isCapsLock || false} />;
      break;
    case 'backspace':
      displayContent = <BackspaceIcon />;
      break;
    case 'space':
      displayContent = 'space';
      break;
    case 'send':
      displayContent = 'send';
      break;
  }
  
  const keyClasses = `
    h-12 flex items-center justify-center rounded-md text-lg font-semibold transition-colors
    bg-[var(--bg-tertiary)] text-[var(--text-primary)]
    active:bg-[var(--accent-primary)] active:text-white
    select-none touch-none
    ${value === 'space' ? 'flex-grow' : 'flex-1'}
    ${isSpecialKey ? 'bg-[var(--bg-interactive)]' : ''}
    ${value === 'send' ? '!bg-[var(--accent-secondary)] !text-white flex-grow' : ''}
    ${value === 'shift' && (isShiftActive || isCapsLock) ? '!bg-[var(--accent-primary)] !text-white' : ''}
  `;

  return (
    <div
      data-key={value}
      className={keyClasses}
      aria-label={value}
    >
      {displayContent}
    </div>
  );
};

export default Key;