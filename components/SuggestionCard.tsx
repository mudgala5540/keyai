import React from 'react';

interface SuggestionCardProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onClick }) => {
  return (
    <button
      onClick={() => onClick(suggestion)}
      className="p-4 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-interactive)] rounded-lg text-left transition-colors duration-200 w-full"
    >
      <p className="text-[var(--text-primary)]">{suggestion}</p>
    </button>
  );
};

export default SuggestionCard;
