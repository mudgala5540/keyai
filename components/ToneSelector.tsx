
import React from 'react';
import { Tone } from '../types';

interface ToneSelectorProps {
  selectedTone: Tone;
  onSelectTone: (tone: Tone) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelectTone }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(Tone).map((tone) => (
        <button
          key={tone}
          onClick={() => onSelectTone(tone)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out
            ${
              selectedTone === tone
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {tone}
        </button>
      ))}
    </div>
  );
};

export default ToneSelector;
