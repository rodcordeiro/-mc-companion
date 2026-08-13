import { Directory, File } from 'expo-file-system';

import { DIMENSIONS, parseDimension, type Dimension } from '@/domain/dimension';
import type { MapMetadata } from '@/domain/map-source';
import { tryParseLooseJsObject } from '@/services/parse-js-object';

const REQUIRED_FILES = ['unmined.map.properties.js', 'unmined.map.regions.js'] as const;

export type ExportValidation = {
  ok: true;
  propertiesFile: File;
  regionsFile: File;
  tilesDir: Directory;
} | {
  ok: false;
  reason: string;
};

function findNamed(dir: Directory, name: string): Directory | File | undefined {
  try {
    return dir.list().find((item) => item.name.toLowerCase() === name.toLowerCase());
  } catch {
    return undefined;
  }
}

/**
 * Valida o mínimo fechado na spec de importação.
 */
export function validateUnminedExport(dir: Directory): ExportValidation {
  const properties = findNamed(dir, 'unmined.map.properties.js');
  const regions = findNamed(dir, 'unmined.map.regions.js');
  const tiles = findNamed(dir, 'tiles');

  if (!(properties instanceof File) || !(regions instanceof File) || !(tiles instanceof Directory)) {
    return {
      ok: false,
      reason: 'Export inválido. Esperado unmined.map.properties.js, unmined.map.regions.js e tiles/.',
    };
  }

  return { ok: true, propertiesFile: properties, regionsFile: regions, tilesDir: tiles };
}

function readNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function directoryExists(root: Directory, segments: string[]): boolean {
  let current: Directory | File | undefined = root;
  for (const segment of segments) {
    if (!(current instanceof Directory)) {
      return false;
    }
    current = findNamed(current, segment);
  }
  return current instanceof Directory;
}

function detectDimensionPaths(root: Directory): Record<Dimension, { available: boolean; tilePath: string }> {
  const overworldTiles = directoryExists(root, ['tiles']);
  const netherCandidates = [
    ['nether', 'tiles'],
    ['tiles', 'nether'],
    ['dim-1', 'tiles'],
    ['tiles_nether'],
  ];
  const endCandidates = [
    ['end', 'tiles'],
    ['tiles', 'end'],
    ['dim1', 'tiles'],
    ['the_end', 'tiles'],
    ['tiles_end'],
  ];

  const firstExisting = (candidates: string[][], fallback: string) => {
    const hit = candidates.find((segments) => directoryExists(root, segments));
    return {
      available: Boolean(hit),
      tilePath: hit ? `${hit.join('/')}/` : fallback,
    };
  };

  return {
    overworld: { available: overworldTiles, tilePath: 'tiles/' },
    nether: firstExisting(netherCandidates, 'nether/tiles/'),
    end: firstExisting(endCandidates, 'end/tiles/'),
  };
}

/**
 * Lê metadados do GridLayer a partir de unmined.map.properties.js (parser tolerante).
 */
export async function parseMapMetadata(root: Directory): Promise<MapMetadata> {
  const validation = validateUnminedExport(root);
  if (!validation.ok) {
    throw new Error(validation.reason);
  }

  const text = await validation.propertiesFile.text();
  const parsed = tryParseLooseJsObject(text);
  const props = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};

  const imageFormat = String(props.imageFormat ?? props.tileFormat ?? 'png').replace(/^\./, '') || 'png';
  const minZoom = readNumber(props.minZoom, 0);
  const maxZoom = readNumber(props.maxZoom, 4);
  const defaultZoom = readNumber(props.defaultZoom ?? props.zoom, Math.min(2, maxZoom));
  const centerX = props.centerX ?? props.spawnX ?? props.x;
  const centerZ = props.centerZ ?? props.spawnZ ?? props.z;

  const dimensions = detectDimensionPaths(root);
  if (props.dimension) {
    const only = parseDimension(props.dimension);
    for (const dim of DIMENSIONS) {
      dimensions[dim].available = dim === only ? dimensions[dim].available || dim === 'overworld' : dimensions[dim].available;
    }
    if (!dimensions[only].available && only === 'overworld') {
      dimensions.overworld.available = true;
    }
  }

  if (!DIMENSIONS.some((dim) => dimensions[dim].available)) {
    dimensions.overworld.available = true;
  }

  return {
    minZoom,
    maxZoom: maxZoom < minZoom ? minZoom : maxZoom,
    defaultZoom,
    imageFormat,
    centerX: typeof centerX === 'number' || (typeof centerX === 'string' && Number.isFinite(Number(centerX)))
      ? Number(centerX)
      : undefined,
    centerZ: typeof centerZ === 'number' || (typeof centerZ === 'string' && Number.isFinite(Number(centerZ)))
      ? Number(centerZ)
      : undefined,
    dimensions,
  };
}
