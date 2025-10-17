import React from 'react';
import WritingStyleUploader from './WritingStyleUploader';
import ThemeSelector from './ThemeSelector';
import { Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleUpload: (style: string | null) => void;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onStyleUpload, selectedTheme, onThemeChange }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-secondary)] rounded-lg shadow-xl p-6 w-11/12 max-w-md text-[var(--text-primary)] border border-[var(--border-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--accent-primary)]">Settings</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-2">Appearance</h3>
                <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={onThemeChange} />
            </div>
            <hr className="border-[var(--border-color)]" />
            <div>
                <h3 className="text-lg font-semibold text-[var(--text-secondary)]">Personalize Your AI</h3>
                <p className="text-sm text-[var(--text-muted)] mt-2 mb-4">
                    Upload a .txt file containing examples of your writing (e.g., emails, messages). 
                    The AI will learn your unique style to provide more personalized suggestions.
                </p>
                <WritingStyleUploader onStyleUpload={onStyleUpload} />
            </div>
             <button
              onClick={onClose}
              className="w-full mt-4 bg-[var(--accent-secondary)] hover:brightness-110 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;