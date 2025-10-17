import React from 'react';
import { Theme } from '../types';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

const themeColors = {
    [Theme.Dark]: { bg: '#111827', accent: '#06b6d4', ring: '#06b6d4' },
    [Theme.Light]: { bg: '#f9fafb', accent: '#0891b2', ring: '#0891b2' },
    [Theme.Oceanic]: { bg: '#0f172a', accent: '#22d3ee', ring: '#22d3ee' },
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="flex flex-wrap gap-4 p-2 rounded-lg bg-[var(--bg-primary)]">
      {Object.values(Theme).map((theme) => {
        const colors = themeColors[theme];
        const isSelected = selectedTheme === theme;

        return (
            <div key={theme} className="flex flex-col items-center gap-2">
                <button
                    onClick={() => onSelectTheme(theme)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] ${isSelected ? 'ring-[var(--accent-primary)]' : 'ring-transparent hover:ring-[var(--accent-primary)]/50'}`}
                    style={{ backgroundColor: colors.bg }}
                    aria-label={`Select ${theme} theme`}
                >
                   <div style={{backgroundColor: colors.accent}} className="w-6 h-6 rounded-full" />
                </button>
                <span className={`text-xs font-medium ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {theme}
                </span>
            </div>
        )
      })}
    </div>
  );
};

export default ThemeSelector;
