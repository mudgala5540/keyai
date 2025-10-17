import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SuggestionStripProps {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionStrip: React.FC<SuggestionStripProps> = ({ suggestions, isLoading, error, onSuggestionClick }) => {
  return (
    <div className="w-full max-w-2xl min-h-[3rem] flex items-center overflow-x-auto gap-2 px-2 text-white text-sm whitespace-nowrap border-y border-gray-700/50">
      {isLoading && (
        <div className="flex items-center justify-center w-full">
            <LoadingSpinner />
            <span className="ml-2 text-gray-400">Thinking...</span>
        </div>
      )}
      {error && <span className="text-red-400 mx-auto">{error}</span>}
      {!isLoading && !error && suggestions.length === 0 && <span className="text-gray-500 mx-auto">AI suggestions will appear here</span>}
      {!isLoading && !error && suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 transition-colors duration-200 flex-shrink-0"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionStrip;