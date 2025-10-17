import React from 'react';
import WritingStyleUploader from './WritingStyleUploader';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleUpload: (style: string | null) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onStyleUpload }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-md text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Personalize Your AI</h3>
            <p className="text-sm text-gray-400">
                Upload a .txt file containing examples of your writing (e.g., emails, messages). 
                The AI will learn your unique style to provide more personalized suggestions.
            </p>
            <WritingStyleUploader onStyleUpload={onStyleUpload} />
             <button
              onClick={onClose}
              className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
