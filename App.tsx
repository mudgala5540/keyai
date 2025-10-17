import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getSuggestions } from './services/geminiService';
import { Tone, Theme } from './types';
import Keyboard from './components/Keyboard';
import ToneSelector from './components/ToneSelector';
import SuggestionStrip from './components/SuggestionStrip';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.Friendly);
  const [writingStyle, setWritingStyle] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || Theme.Dark;
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.toLowerCase());
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchSuggestions = useCallback(async (currentText: string) => {
    if (!currentText.trim() || currentText.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSuggestions(currentText, selectedTone, writingStyle);
      setSuggestions(result);
    } catch (e) {
      setError('Failed to get suggestions.');
      console.error(e);
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
    }, 1000); // 1-second debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [text, fetchSuggestions]);

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'backspace':
        setText((prev) => prev.slice(0, -1));
        break;
      case 'space':
        setText((prev) => prev + ' ');
        break;
      case 'send':
        // Logic for sending the message could be implemented here
        console.log('Sending:', text);
        setText('');
        setSuggestions([]);
        break;
      default:
        // This handles both single characters and multi-character swiped words
        if (key.length > 1) { // It's a swiped word
          setText((prev) => (prev ? prev + ' ' : '') + key);
        } else { // It's a single character
          setText((prev) => prev + key);
        }
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)] p-4 font-sans">
      <div className="w-full max-w-sm h-[80vh] max-h-[900px] flex flex-col bg-[var(--bg-secondary)] rounded-3xl shadow-2xl border-4 border-gray-700 overflow-hidden">
        <Header onSettingsClick={() => setIsSettingsOpen(true)} />
        <main className="flex-grow flex flex-col p-3 gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full flex-grow p-3 bg-[var(--bg-tertiary)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] border border-[var(--border-color)]"
            placeholder="Start typing..."
          />
          <ToneSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />
           <SuggestionStrip
            suggestions={suggestions}
            isLoading={isLoading}
            error={error}
            onSuggestionClick={handleSuggestionClick}
          />
        </main>
        <footer className="flex justify-center p-2 bg-[var(--bg-secondary)]">
          <Keyboard onKeyPress={handleKeyPress} />
        </footer>
      </div>
       <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStyleUpload={setWritingStyle}
        selectedTheme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
};

export default App;