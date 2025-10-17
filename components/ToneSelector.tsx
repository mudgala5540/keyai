import React from 'react';
import { Tone } from '../types';

interface ToneSelectorProps {
  selectedTone: Tone;
  onSelectTone: (tone: Tone) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelectTone }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.values(Tone).map((tone) => (
        <button
          key={tone}
          onClick={() => onSelectTone(tone)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
            ${
              selectedTone === tone
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-interactive)]'
            }`}
        >
          {tone}
        </button>
      ))}
    </div>
  );
};

export default ToneSelector;