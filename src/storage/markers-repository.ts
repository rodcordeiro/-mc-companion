import type { Marker } from '@/domain/marker';
import { readJsonFile, writeJsonFile } from '@/storage/json-store';
import { markersFile } from '@/storage/paths';

export async function loadMarkers(): Promise<Marker[]> {
  return readJsonFile<Marker[]>(markersFile(), []);
}

export async function saveMarkers(markers: Marker[]): Promise<void> {
  await writeJsonFile(markersFile(), markers);
}
