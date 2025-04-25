// components/FilterPanel.tsx
'use client';

import { Filters } from '@/lib/query';

interface Props {
  value: Filters;
  onChange: (v: Filters) => void;
  specialties: string[];
}

export default function FilterPanel({ value, onChange, specialties }: Props) {
  const toggleSpec = (s: string) => {
    const set = new Set(value.specs || []);
    set.has(s) ? set.delete(s) : set.add(s);
    onChange({ ...value, specs: Array.from(set) });
  };

  return (
    <aside className="w-full md:w-72 p-4 border rounded-lg space-y-6">
      {/* Consultation Mode */}
      <div>
        <h3 data-testid="filter-header-moc" className="font-semibold mb-2">
          Consultation Mode
        </h3>
        {['Video Consult', 'In Clinic'].map(m => (
          <label key={m} className="flex items-center gap-2">
            <input
              type="radio"
              data-testid={
                m === 'Video Consult'
                  ? 'filter-video-consult'
                  : 'filter-in-clinic'
              }
              checked={value.mode === m}
              onChange={() => onChange({ ...value, mode: m as any })}
            />
            {m}
          </label>
        ))}
      </div>

      {/* Specialities */}
      <div>
        <h3 data-testid="filter-header-speciality" className="font-semibold mb-2">
          Speciality
        </h3>
        <div className="h-48 overflow-y-auto space-y-1">
          {specialties.map(s => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                data-testid={`filter-specialty-${s.replace(/[\s/]/g, '-')}`}
                checked={value.specs?.includes(s) || false}
                onChange={() => toggleSpec(s)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 data-testid="filter-header-sort" className="font-semibold mb-2">
          Sort
        </h3>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            data-testid="sort-fees"
            checked={value.sort === 'fees'}
            onChange={() => onChange({ ...value, sort: 'fees' })}
          />
          Fees (Low → High)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            data-testid="sort-experience"
            checked={value.sort === 'experience'}
            onChange={() => onChange({ ...value, sort: 'experience' })}
          />
          Experience (High → Low)
        </label>
      </div>
    </aside>
  );
}
