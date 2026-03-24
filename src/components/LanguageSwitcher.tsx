import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-gray-100 z-50">
      <Globe size={16} className="text-primary" />
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as 'en' | 'od')}
        className="bg-transparent font-bold text-sm text-text outline-none cursor-pointer appearance-none pr-2"
      >
        <option value="en">English</option>
        <option value="od">ଓଡ଼ିଆ</option>
      </select>
    </div>
  );
}
