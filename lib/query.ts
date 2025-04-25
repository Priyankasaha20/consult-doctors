export interface Filters {
  search?: string;
  mode?: 'Video Consult' | 'In Clinic';
  specs?: string[];           
  sort?: 'fees' | 'experience';
}


export const parseQuery = (q: URLSearchParams): Filters => ({
  search: q.get('search') || undefined,
  mode:   (q.get('mode') as Filters['mode']) || undefined,
  specs:  q.getAll('spec'),
  sort:   (q.get('sort') as Filters['sort']) || undefined,
});

export const stringify = (f: Filters): string => {
  const q = new URLSearchParams();
  if (f.search) q.set('search', f.search);
  if (f.mode)   q.set('mode',   f.mode);
  f.specs?.forEach(s => q.append('spec', s));
  if (f.sort)   q.set('sort',   f.sort);
  return q.toString();
};
