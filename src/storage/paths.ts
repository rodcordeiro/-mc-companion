import { Directory, File, Paths } from 'expo-file-system';

export function mapsRoot(): Directory {
  return new Directory(Paths.document, 'maps');
}

export function mapDirectory(mapId: string): Directory {
  return new Directory(Paths.document, 'maps', mapId);
}

export function markersFile(): File {
  return new File(Paths.document, 'markers.json');
}

export function appMetaFile(): File {
  return new File(Paths.document, 'app-meta.json');
}

export function ensureMapsRoot(): Directory {
  const root = mapsRoot();
  if (!root.exists) {
    root.create();
  }
  return root;
}
