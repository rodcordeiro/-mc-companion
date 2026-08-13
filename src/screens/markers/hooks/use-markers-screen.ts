import { dimensionSortIndex } from '@/domain/dimension';
import type { Marker } from '@/domain/marker';
import { useAppState } from '@/state/app-provider';

function compareMarkers(a: Marker, b: Marker): number {
  const dim = dimensionSortIndex(a.dimensao) - dimensionSortIndex(b.dimensao);
  if (dim !== 0) {
    return dim;
  }
  const name = a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' });
  if (name !== 0) {
    return name;
  }
  if (a.x !== b.x) {
    return a.x - b.x;
  }
  return a.z - b.z;
}

export function useMarkersScreen() {
  const state = useAppState();
  const sorted = [...state.markers].sort(compareMarkers);
  return { ...state, sorted };
}
