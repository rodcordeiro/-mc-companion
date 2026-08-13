import { Directory, File } from 'expo-file-system';

import { parseDimension, type Dimension } from '@/domain/dimension';
import { tryParseLooseJsObject } from '@/services/parse-js-object';

export type ParsedExportMarker = {
  nome: string;
  dimensao: Dimension;
  x: number;
  z: number;
  y?: number;
  descricao?: string;
  icon?: string;
  color?: string;
};

const MARKER_FILE_HINTS = [
  'unmined.markers.js',
  'custom.markers.js',
  'unmined.custom.markers.js',
  'markers.json',
  'unmined.index.markers.js',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function lookLikeMarker(value: unknown): ParsedExportMarker | null {
  if (!isRecord(value)) {
    return null;
  }
  const x = asFiniteNumber(value.x ?? value.X ?? value.posX);
  const z = asFiniteNumber(value.z ?? value.Z ?? value.posZ);
  const nome = String(value.nome ?? value.name ?? value.text ?? value.label ?? value.title ?? '').trim();
  if (x === undefined || z === undefined || !nome) {
    return null;
  }
  const y = asFiniteNumber(value.y ?? value.Y ?? value.posY);
  const descricao = String(value.descricao ?? value.description ?? value.subtitle ?? '').trim();
  return {
    nome,
    dimensao: parseDimension(value.dimensao ?? value.dimension ?? value.world ?? value.dim),
    x,
    z,
    y,
    descricao: descricao || undefined,
    icon: typeof value.icon === 'string' ? value.icon : undefined,
    color: typeof value.color === 'string' ? value.color : typeof value.colour === 'string' ? value.colour : undefined,
  };
}

function collectMarkers(node: unknown, acc: ParsedExportMarker[]): void {
  const direct = lookLikeMarker(node);
  if (direct) {
    acc.push(direct);
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      collectMarkers(item, acc);
    }
    return;
  }
  if (isRecord(node)) {
    for (const value of Object.values(node)) {
      collectMarkers(value, acc);
    }
  }
}

function listMarkerFiles(dir: Directory): File[] {
  const files: File[] = [];
  try {
    for (const item of dir.list()) {
      if (item instanceof File) {
        const name = item.name.toLowerCase();
        if (MARKER_FILE_HINTS.includes(name) || name.includes('marker')) {
          files.push(item);
        }
      } else if (item instanceof Directory && item.name.toLowerCase() !== 'tiles') {
        files.push(...listMarkerFiles(item));
      }
    }
  } catch {
    return files;
  }
  return files;
}

export type MarkerParseResult =
  | { status: 'missing' }
  | { status: 'ok'; markers: ParsedExportMarker[] }
  | { status: 'failed'; error: string };

/**
 * Parser tolerante de markers do export uNmINeD (schema varia).
 */
export async function parseExportMarkers(root: Directory): Promise<MarkerParseResult> {
  const files = listMarkerFiles(root);
  if (files.length === 0) {
    return { status: 'missing' };
  }

  const collected: ParsedExportMarker[] = [];
  let parseError: string | undefined;

  for (const file of files) {
    try {
      const text = await file.text();
      const trimmed = text.trim();
      if (!trimmed) {
        continue;
      }
      let parsed: unknown;
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          parsed = JSON.parse(trimmed);
        } catch {
          parsed = tryParseLooseJsObject(trimmed);
        }
      } else {
        parsed = tryParseLooseJsObject(trimmed);
      }
      if (parsed == null) {
        parseError = `Não foi possível interpretar ${file.name}`;
        continue;
      }
      collectMarkers(parsed, collected);
    } catch (error) {
      parseError = error instanceof Error ? error.message : String(error);
    }
  }

  if (collected.length === 0 && parseError) {
    return { status: 'failed', error: parseError };
  }
  if (collected.length === 0 && files.length > 0 && parseError) {
    return { status: 'failed', error: parseError };
  }

  return { status: 'ok', markers: collected };
}
