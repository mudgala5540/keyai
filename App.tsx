import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Tone } from './types';
import { getSuggestions } from './services/geminiService';
import ToneSelector from './components/ToneSelector';
import SuggestionStrip from './components/SuggestionStrip';
import Keyboard from './components/Keyboard';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.Friendly);
  const [writingStyle, setWritingStyle] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleSendMessage = () => {
    console.log("Message sent:", text);
    // Here you would typically handle the message, e.g., send it to a chat.
    // For this demo, we will just clear the text input.
    setText('');
    setSuggestions([]);
  };

  const fetchSuggestions = useCallback(async (currentText: string) => {
    if (!currentText.trim() || currentText.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSuggestions(currentText, selectedTone, writingStyle);
      setSuggestions(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTone, writingStyle]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 750); // 750ms debounce delay

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [text, fetchSuggestions]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    textareaRef.current?.focus();
    setSuggestions([]); 
  };
  
  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setText(prev => prev.slice(0, -1));
    } else if (key === 'send') {
      handleSendMessage();
    } else if (key === 'space') {
      setText(prev => prev + ' ');
    } else {
       // Handle single chars and full words from swipe
      setText(prev => (prev.length > 0 && prev[prev.length -1] !== ' ' && key.length > 1) ? prev + ' ' + key : prev + key);
    }
    textareaRef.current?.focus();
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <div className="w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold text-cyan-400">AI Keyboard</h1>
            <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full h-48 bg-gray-800 border-2 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg p-4 text-lg resize-none outline-none transition-colors"
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing or use the keyboard..."
        />
        <ToneSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />
        <SuggestionStrip 
          suggestions={suggestions} 
          isLoading={isLoading} 
          error={error} 
          onSuggestionClick={handleSuggestionClick} 
        />
         <div className="pt-4 w-full">
            <Keyboard onKeyPress={handleKeyPress} />
         </div>
      </div>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStyleUpload={setWritingStyle}
      />
    </div>
  );
};

export default App;