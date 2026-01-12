'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function SeedLoader() {
  const loadSeedData = useStore((state) => state.loadSeedData);

  useEffect(() => {
    loadSeedData();
  }, [loadSeedData]);

  return null;
}
