// hooks/useDoctors.ts
import { useEffect, useState } from 'react';
import { Doctor } from '@/types';

export const useDoctors = () => {
  const [data, setData]       = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then(r => r.json())
      .then((json: Doctor[]) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
