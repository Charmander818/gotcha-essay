import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

const themes = [
  { id: 'lavender', name: 'Lavender (Purple)', colorClass: 'bg-[#a855f7]' },
  { id: 'matcha', name: 'Matcha (Green)', colorClass: 'bg-[#52af75]' },
  { id: 'sakura', name: 'Sakura (Pink)', colorClass: 'bg-[#f63c76]' },
  { id: 'mist', name: 'Mist (Blue)', colorClass: 'bg-[#607d9c]' },
  { id: 'latte', name: 'Latte (Beige)', colorClass: 'bg-[#aa9084]' },
];

export const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('lavender');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') || 'lavender';
    setCurrentTheme(saved);
    if (saved !== 'lavender') {
       document.documentElement.setAttribute('data-theme', saved);
    } else {
       document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const selectTheme = (id: string) => {
    setCurrentTheme(id);
    localStorage.setItem('app-theme', id);
    if (id === 'lavender') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative mt-auto mb-4 w-full flex justify-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-slate-800 text-purple-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        title="Change Theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute left-16 bottom-0 ml-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
          <div className="px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 mb-1">
            Choose Theme
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTheme(t.id)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 hover:bg-slate-800 transition-colors ${currentTheme === t.id ? 'text-white font-bold' : 'text-slate-300'}`}
            >
              <div className={`w-3 h-3 rounded-full ${t.colorClass} ${currentTheme === t.id ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-400' : ''}`}></div>
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
