'use client';

import { useState, useMemo } from 'react';
import { Doctor } from '@/types';

interface Props {
  doctors: Doctor[];
  value?: string;
  onChange: (v: string) => void;

  // NEW:
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  doctors,
  value = '',
  onChange,
  placeholder = 'Search doctors…',
  className = '',
}: Props) {
  const [focus, setFocus] = useState(false);

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    return doctors
      .filter(d => d.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 3);
  }, [value, doctors]);

  return (
    <div className="relative">
      <input
        data-testid="autocomplete-input"
        className={`
          ${className}
          transition
        `}
        placeholder={placeholder}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onChange(value)}
      />

      {focus && suggestions.length > 0 && (
        <ul className="
            absolute z-20 w-full mt-1
            bg-slate-800 text-white border border-slate-600
            rounded-lg shadow-lg overflow-hidden
          "
        >
          {suggestions.map(d => (
            <li
              key={d.id}
              data-testid="suggestion-item"
              className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
              onMouseDown={() => onChange(d.name)}
            >
              {d.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
