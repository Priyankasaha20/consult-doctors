'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo }         from 'react';
import { Search, Filter, X }                    from 'lucide-react';

import { useDoctors }    from '@/hooks/useDoctors';
import { parseQuery, stringify, Filters } from '@/lib/query';
import { getSpecs }      from '@/lib/getSpecs';

import SearchBar     from '@/components/SearchBar';
import FilterPanel   from '@/components/FilterPanel';
import DoctorCard    from '@/components/DoctorCard';

export default function Home() {
  const { data: doctors, loading } = useDoctors();
  const router      = useRouter();
  const qs          = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => parseQuery(qs));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // sync with back/forward
  useEffect(() => setFilters(parseQuery(qs)), [qs]);

  const apply = (upd: Filters) => {
    setFilters(upd);
    router.push(`?${stringify(upd)}`, { scroll: false });
  };

  // actual filter & sort logic
  const filtered = useMemo(() => {
    let list = doctors;

    // search by name
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q));
    }

    // consultation mode
    if (filters.mode === 'Video Consult') {
      list = list.filter(d => d.video_consult);
    } else if (filters.mode === 'In Clinic') {
      list = list.filter(d => d.in_clinic);
    }

    // specialties (specs)
    if (filters.specs?.length) {
      list = list.filter(d =>
        getSpecs(d).some(s => filters.specs!.includes(s))
      );
    }

    // sort by fee or experience
    if (filters.sort === 'fees') {
      list = [...list].sort((a, b) => {
        const fa = Number(a.fees?.replace(/[^\d]/g, '') || 0);
        const fb = Number(b.fees?.replace(/[^\d]/g, '') || 0);
        return fa - fb;
      });
    } else if (filters.sort === 'experience') {
      list = [...list].sort((a, b) => {
        const ea = Number(a.experience?.match(/\d+/)?.[0] || 0);
        const eb = Number(b.experience?.match(/\d+/)?.[0] || 0);
        return eb - ea;
      });
    }

    return list;
  }, [doctors, filters]);

  // unique specialties
  const allSpecs = useMemo(() => {
    const s = new Set<string>();
    doctors.forEach(d => getSpecs(d).forEach(sp => s.add(sp)));
    return Array.from(s).sort();
  }, [doctors]);

  // count active filters
  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.search)    c++;
    if (filters.mode)      c++;
    if (filters.specs?.length) c++;
    if (filters.sort)      c++;
    return c;
  }, [filters]);

  return (
    <main className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen text-white">

      {/* Hero */}
      <header className="py-16 text-center bg-slate-800 bg-opacity-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500 opacity-5"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Find Your Doctor
          </h1>
          <p className="text-slate-300 text-lg">
            Search, filter by consultation mode or specialty, and sort by fee or experience.
          </p>
        </div>
      </header>

      {/* Search & Filter bar */}
      <div className="sticky top-0 z-30 bg-slate-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          {/* Search input */}
          <div className="w-full md:flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <SearchBar
              doctors={doctors}
              value={filters.search}
              onChange={v => apply({ ...filters, search: v })}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Search by name..."
            />
          </div>

          {/* Mobile filters toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-medium transition w-full justify-center"
          >
            <Filter size={18} />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Clear all (desktop) */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => apply({})}
              className="hidden md:flex items-center gap-2 text-sm py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
            >
              <X size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-1/4 sticky top-24">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Filters</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => apply({})}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              )}
            </div>
            <FilterPanel
              value={filters}
              onChange={apply}
              specialties={allSpecs}
            />
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-90 z-40 flex items-end">
            <div className="bg-slate-800 w-full p-6 rounded-t-2xl max-h-[80vh] overflow-auto animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                value={filters}
                onChange={apply}
                specialties={allSpecs}
              />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 bg-slate-700 rounded-lg text-center hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 bg-blue-600 rounded-lg text-center hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400">Loading doctors...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'Doctor' : 'Doctors'} Found
                </h2>
                <div className="hidden md:flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-slate-400">
                    Sort:
                  </label>
                  <select
                    id="sort"
                    value={filters.sort || ''}
                    onChange={e => apply({ ...filters, sort: e.target.value as any })}
                    className="bg-slate-700 text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Relevance</option>
                    <option value="fees">Fee: Low → High</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map(d => (
                    <DoctorCard key={d.id} d={d} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-800 rounded-xl">
                  <Search size={24} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    No doctors match your criteria
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={() => apply({})}
                    className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>{doctors.length} healthcare professionals available</p>
          <p className="mt-2">
            © {new Date().getFullYear()} Doctor Finder. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
