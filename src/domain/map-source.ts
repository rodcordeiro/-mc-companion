import type { Dimension } from '@/domain/dimension';

export type ImportPhase =
  | 'idle'
  | 'validating'
  | 'copying'
  | 'importing-markers'
  | 'ok'
  | 'failed'
  | 'markers-failed';

export type MapDimensionInfo = {
  available: boolean;
  tilePath: string;
};

export type MapMetadata = {
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  imageFormat: string;
  centerX?: number;
  centerZ?: number;
  dimensions: Record<Dimension, MapDimensionInfo>;
};

export type MapSource = {
  id: string;
  directoryUri: string;
  metadata: MapMetadata;
};

export type AppMeta = {
  activeMapId: string | null;
  lastImportPhase: ImportPhase;
  lastImportError?: string;
  mapSource: MapSource | null;
};
