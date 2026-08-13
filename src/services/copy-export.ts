import { Directory, Paths } from 'expo-file-system';

import { ensureMapsRoot } from '@/storage/paths';

/**
 * Abre o seletor de pasta do Android (SAF / Directory v2).
 */
export async function pickExportDirectory(): Promise<Directory | null> {
  try {
    const picked = await Directory.pickDirectoryAsync();
    return new Directory(picked.uri);
  } catch {
    return null;
  }
}

/**
 * Copia o export selecionado para uma pasta nova no storage do app.
 */
export function copyExportToAppStorage(source: Directory, mapId: string): Directory {
  ensureMapsRoot();
  const dest = new Directory(Paths.document, 'maps', mapId);
  if (dest.exists) {
    dest.delete();
  }
  source.copy(dest);
  return dest;
}

export function deleteMapCopy(mapId: string): void {
  const dest = new Directory(Paths.document, 'maps', mapId);
  if (dest.exists) {
    dest.delete();
  }
}
