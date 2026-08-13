import * as Crypto from 'expo-crypto';
import { Directory } from 'expo-file-system';
import { router } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DIMENSIONS, type Dimension } from '@/domain/dimension';
import type { ImportPhase, MapSource } from '@/domain/map-source';
import type { Marker, MarkerDraft } from '@/domain/marker';
import { formatBytes, isInsufficientSpaceError, isPermissionError, measureDirectorySize } from '@/services/format-bytes';
import { importUnminedExport, type ImportMode } from '@/services/import-map';
import { pickExportDirectory } from '@/services/copy-export';
import { loadAppMeta, saveAppMeta } from '@/storage/app-meta-repository';
import { loadMarkers, saveMarkers } from '@/storage/markers-repository';
import { mapDirectory } from '@/storage/paths';

export type MapFocusCommand = {
  dimension: Dimension;
  x: number;
  z: number;
};

export type SizeConfirmRequest = {
  bytes: number;
  label: string;
  mode: ImportMode;
  source: Directory;
};

type AppStateValue = {
  ready: boolean;
  markers: Marker[];
  mapSource: MapSource | null;
  importPhase: ImportPhase;
  importMessage: string;
  lastError: string | null;
  permissionDenied: boolean;
  selectedDimension: Dimension;
  setSelectedDimension: (dimension: Dimension) => void;
  mapFocus: MapFocusCommand | null;
  consumeMapFocus: () => void;
  sizeConfirm: SizeConfirmRequest | null;
  confirmSizeImport: () => Promise<void>;
  cancelSizeImport: () => void;
  beginImport: (mode: ImportMode) => Promise<void>;
  saveMarker: (draft: MarkerDraft, existingId?: string) => string | null;
  deleteMarker: (id: string) => void;
  focusMarkerOnMap: (marker: Marker) => void;
  formErrors: Partial<Record<keyof MarkerDraft, string>>;
  clearFormErrors: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function parseCoordinate(value: string): number | null {
  const n = Number(String(value).trim().replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [mapSource, setMapSource] = useState<MapSource | null>(null);
  const [importPhase, setImportPhase] = useState<ImportPhase>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<Dimension>('overworld');
  const [mapFocus, setMapFocus] = useState<MapFocusCommand | null>(null);
  const [sizeConfirm, setSizeConfirm] = useState<SizeConfirmRequest | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof MarkerDraft, string>>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedMarkers, meta] = await Promise.all([loadMarkers(), loadAppMeta()]);
      if (cancelled) {
        return;
      }
      setMarkers(storedMarkers);
      const source = meta.mapSource;
      if (source?.id) {
        const dir = mapDirectory(source.id);
        if (dir.exists) {
          setMapSource({ ...source, directoryUri: dir.uri });
        } else {
          setMapSource(null);
        }
      }
      setImportPhase(meta.lastImportPhase === 'copying' || meta.lastImportPhase === 'validating' || meta.lastImportPhase === 'importing-markers'
        ? 'failed'
        : meta.lastImportPhase);
      setLastError(meta.lastImportError ?? null);
      setSelectedDimension('overworld');
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (nextMarkers: Marker[], nextSource: MapSource | null, phase: ImportPhase, error?: string) => {
    await Promise.all([
      saveMarkers(nextMarkers),
      saveAppMeta({
        activeMapId: nextSource?.id ?? null,
        mapSource: nextSource,
        lastImportPhase: phase,
        lastImportError: error,
      }),
    ]);
  }, []);

  const runImport = useCallback(async (source: Directory, mode: ImportMode) => {
    setPermissionDenied(false);
    setLastError(null);
    const result = await importUnminedExport({
      source,
      mode,
      currentMapId: mapSource?.id ?? null,
      currentMarkers: markers,
      onProgress: ({ phase, message }) => {
        setImportPhase(phase);
        setImportMessage(message);
      },
    });

    if (!result.ok) {
      const error = result.insufficientSpace
        ? 'Não há espaço suficiente no aparelho.'
        : result.error.includes('original')
          ? result.error
          : `A importação falhou. O export original não foi alterado.`;
      setImportPhase('failed');
      setImportMessage(error);
      setLastError(error);
      await persist(markers, mapSource, 'failed', error);
      return;
    }

    const phase: ImportPhase = result.markersFailed ? 'markers-failed' : 'ok';
    const error = result.markersFailed
      ? 'Mapa importado. Não foi possível importar os marcadores.'
      : undefined;
    setMapSource(result.mapSource);
    setMarkers(result.markers);
    setImportPhase(phase);
    setImportMessage(error ?? 'Fonte de mapa importada.');
    setLastError(error ?? null);
    setSelectedDimension('overworld');
    await persist(result.markers, result.mapSource, phase, error);
  }, [mapSource, markers, persist]);

  const beginImport = useCallback(async (mode: ImportMode) => {
    try {
      const source = await pickExportDirectory();
      if (!source) {
        return;
      }
      const bytes = measureDirectorySize(source);
      if (typeof bytes === 'number') {
        setSizeConfirm({
          bytes,
          label: formatBytes(bytes),
          mode,
          source,
        });
        return;
      }
      await runImport(source, mode);
    } catch (error) {
      if (isPermissionError(error)) {
        setPermissionDenied(true);
        setLastError('Sem acesso à pasta, o app não consegue importar o mapa.');
        return;
      }
      const message = isInsufficientSpaceError(error)
        ? 'Não há espaço suficiente no aparelho.'
        : 'A importação falhou. O export original não foi alterado.';
      setImportPhase('failed');
      setLastError(message);
    }
  }, [runImport]);

  const confirmSizeImport = useCallback(async () => {
    if (!sizeConfirm) {
      return;
    }
    const request = sizeConfirm;
    setSizeConfirm(null);
    await runImport(request.source, request.mode);
  }, [runImport, sizeConfirm]);

  const cancelSizeImport = useCallback(() => {
    setSizeConfirm(null);
  }, []);

  const saveMarker = useCallback((draft: MarkerDraft, existingId?: string) => {
    const errors: Partial<Record<keyof MarkerDraft, string>> = {};
    if (!draft.nome.trim()) {
      errors.nome = 'Informe o nome.';
    }
    if (!DIMENSIONS.includes(draft.dimensao)) {
      errors.dimensao = 'Informe a dimensão.';
    }
    const x = parseCoordinate(draft.x);
    const z = parseCoordinate(draft.z);
    if (x == null) {
      errors.x = 'Informe X e Z.';
    }
    if (z == null) {
      errors.z = 'Informe X e Z.';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return null;
    }

    setFormErrors({});
    const y = draft.y?.trim() ? parseCoordinate(draft.y) : undefined;
    const next: Marker = {
      id: existingId ?? Crypto.randomUUID(),
      nome: draft.nome.trim(),
      dimensao: draft.dimensao,
      x: x as number,
      z: z as number,
      y: y ?? undefined,
      descricao: draft.descricao?.trim() || undefined,
      tags: draft.tags ?? '',
      imported: existingId ? Boolean(markers.find((item) => item.id === existingId)?.imported) : false,
      updatedAt: new Date().toISOString(),
    };

    const nextMarkers = existingId
      ? markers.map((item) => (item.id === existingId ? { ...item, ...next, id: existingId } : item))
      : [...markers, next];
    setMarkers(nextMarkers);
    void persist(nextMarkers, mapSource, importPhase === 'idle' ? 'ok' : importPhase, lastError ?? undefined);
    return next.id;
  }, [importPhase, lastError, mapSource, markers, persist]);

  const deleteMarker = useCallback((id: string) => {
    const nextMarkers = markers.filter((item) => item.id !== id);
    setMarkers(nextMarkers);
    void persist(nextMarkers, mapSource, importPhase === 'idle' ? 'ok' : importPhase, lastError ?? undefined);
  }, [importPhase, lastError, mapSource, markers, persist]);

  const focusMarkerOnMap = useCallback((marker: Marker) => {
    setSelectedDimension(marker.dimensao);
    setMapFocus({ dimension: marker.dimensao, x: marker.x, z: marker.z });
    router.push('/');
  }, []);

  const consumeMapFocus = useCallback(() => {
    setMapFocus(null);
  }, []);

  const clearFormErrors = useCallback(() => setFormErrors({}), []);

  const value = useMemo<AppStateValue>(() => ({
    ready,
    markers,
    mapSource,
    importPhase,
    importMessage,
    lastError,
    permissionDenied,
    selectedDimension,
    setSelectedDimension,
    mapFocus,
    consumeMapFocus,
    sizeConfirm,
    confirmSizeImport,
    cancelSizeImport,
    beginImport,
    saveMarker,
    deleteMarker,
    focusMarkerOnMap,
    formErrors,
    clearFormErrors,
  }), [
    beginImport,
    cancelSizeImport,
    clearFormErrors,
    confirmSizeImport,
    consumeMapFocus,
    deleteMarker,
    focusMarkerOnMap,
    formErrors,
    importMessage,
    importPhase,
    lastError,
    mapFocus,
    mapSource,
    markers,
    permissionDenied,
    ready,
    saveMarker,
    selectedDimension,
    sizeConfirm,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState deve estar dentro de AppStateProvider');
  }
  return value;
}
