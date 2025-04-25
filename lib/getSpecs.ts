// lib/getSpecs.ts
export const getSpecs = (d: any): string[] => {

  if (Array.isArray(d.specialities)) {
    return d.specialities.map((s: any) => s.name || '').filter(Boolean);
  }
  
  return [];
};
