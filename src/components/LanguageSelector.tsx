import React from 'react';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, label }) => {
  return (
    <div className="language-selector">
      <label htmlFor={`language-select-${label}`}>{label}: </label>
      <select
        id={`language-select-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;