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
    <div className="w-full min-h-[3.25rem] flex-shrink-0 flex items-center overflow-x-auto gap-2 px-3 text-[var(--text-primary)] text-sm whitespace-nowrap border-y border-[var(--border-color)] suggestion-scrollbar">
      {isLoading && (
        <div className="flex items-center justify-center w-full">
            <LoadingSpinner />
            <span className="ml-2 text-[var(--text-muted)]">Thinking...</span>
        </div>
      )}
      {error && <span className="text-red-400 mx-auto">{error}</span>}
      {!isLoading && !error && suggestions.length === 0 && <span className="text-[var(--text-muted)] mx-auto">AI suggestions will appear here</span>}
      {!isLoading && !error && suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-interactive)] rounded-md px-3 py-1.5 transition-colors duration-200 flex-shrink-0"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionStrip;
