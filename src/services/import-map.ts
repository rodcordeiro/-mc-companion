import * as Crypto from 'expo-crypto';

import type { Marker } from '@/domain/marker';
import type { ImportPhase, MapSource } from '@/domain/map-source';
import { markerIdempotencyKey } from '@/services/slug';
import { copyExportToAppStorage, deleteMapCopy } from '@/services/copy-export';
import { parseExportMarkers, type ParsedExportMarker } from '@/services/parse-markers';
import { parseMapMetadata, validateUnminedExport } from '@/services/parse-unmined';
import type { Directory } from 'expo-file-system';

export type ImportMode = 'first' | 'update' | 'replace';

export type ImportProgress = {
  phase: ImportPhase;
  message: string;
};

export type ImportSuccess = {
  ok: true;
  mapSource: MapSource;
  markers: Marker[];
  markersFailed: boolean;
};

export type ImportFailure = {
  ok: false;
  phase: ImportPhase;
  error: string;
  insufficientSpace?: boolean;
};

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return Crypto.randomUUID();
}

function mergeImportedMarkers(
  current: Marker[],
  incoming: ParsedExportMarker[],
  mode: ImportMode,
): Marker[] {
  if (mode === 'replace') {
    current = [];
  }

  const byKey = new Map(current.map((marker) => [markerIdempotencyKey(marker), marker]));

  for (const item of incoming) {
    const key = markerIdempotencyKey(item);
    const existing = byKey.get(key);
    if (existing) {
      const updated: Marker = {
        ...existing,
        descricao: item.descricao,
        icon: item.icon,
        color: item.color,
        imported: true,
        updatedAt: nowIso(),
      };
      byKey.set(key, updated);
    } else {
      byKey.set(key, {
        id: newId(),
        nome: item.nome,
        dimensao: item.dimensao,
        x: item.x,
        z: item.z,
        y: item.y,
        descricao: item.descricao,
        imported: true,
        icon: item.icon,
        color: item.color,
        updatedAt: nowIso(),
      });
    }
  }

  return [...byKey.values()];
}

/**
 * Importa um export uNmINeD: valida, copia, troca a Fonte e trata marcadores.
 */
export async function importUnminedExport(input: {
  source: Directory;
  mode: ImportMode;
  currentMapId: string | null;
  currentMarkers: Marker[];
  onProgress: (progress: ImportProgress) => void;
}): Promise<ImportSuccess | ImportFailure> {
  const { source, mode, currentMapId, currentMarkers, onProgress } = input;

  onProgress({ phase: 'validating', message: 'Validando export…' });
  const validation = validateUnminedExport(source);
  if (!validation.ok) {
    return { ok: false, phase: 'failed', error: validation.reason };
  }

  const mapId = newId();
  onProgress({ phase: 'copying', message: 'Importando mapa para o app…' });

  try {
    const dest = copyExportToAppStorage(source, mapId);
    const copyValidation = validateUnminedExport(dest);
    if (!copyValidation.ok) {
      deleteMapCopy(mapId);
      return { ok: false, phase: 'failed', error: copyValidation.reason };
    }

    const metadata = await parseMapMetadata(dest);
    const mapSource: MapSource = {
      id: mapId,
      directoryUri: dest.uri,
      metadata,
    };

    if (currentMapId && currentMapId !== mapId) {
      try {
        deleteMapCopy(currentMapId);
      } catch {
        // Lixo no disco não desfaz a Fonte nova.
      }
    }

    onProgress({ phase: 'importing-markers', message: 'Importando marcadores…' });
    const parsed = await parseExportMarkers(dest);

    if (parsed.status === 'failed') {
      return {
        ok: true,
        mapSource,
        markers: currentMarkers,
        markersFailed: true,
      };
    }

    if (parsed.status === 'missing') {
      const markers = mode === 'replace' ? [] : currentMarkers;
      return { ok: true, mapSource, markers, markersFailed: false };
    }

    return {
      ok: true,
      mapSource,
      markers: mergeImportedMarkers(currentMarkers, parsed.markers, mode),
      markersFailed: false,
    };
  } catch (error) {
    try {
      deleteMapCopy(mapId);
    } catch {
      // rollback best-effort da cópia incompleta
    }
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      phase: 'failed',
      error: message,
      insufficientSpace: /enospc|no space|espaço|disk full/i.test(message),
    };
  }
}
