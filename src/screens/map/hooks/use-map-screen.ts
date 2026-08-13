import { useMemo } from 'react';
import { router } from 'expo-router';

import { DIMENSIONS, type Dimension } from '@/domain/dimension';
import { useAppState } from '@/state/app-provider';

export function useMapScreen() {
  const state = useAppState();

  const availability = useMemo(() => {
    const fromSource = state.mapSource?.metadata.dimensions;
    return Object.fromEntries(
      DIMENSIONS.map((dimension) => [
        dimension,
        { available: fromSource?.[dimension]?.available ?? false },
      ]),
    ) as Record<Dimension, { available: boolean }>;
  }, [state.mapSource]);

  return {
    ...state,
    availability,
    goToSettings: () => router.push('/settings'),
  };
}
