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

export type MarkerParseResult =
  | { status: 'missing' }
  | { status: 'ok'; markers: ParsedExportMarker[] }
  | { status: 'failed'; error: string };

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

export function isMarkerFileName(name: string): boolean {
  const lower = name.toLowerCase();
  return MARKER_FILE_HINTS.includes(lower) || lower.includes('marker');
}

export function lookLikeMarker(value: unknown): ParsedExportMarker | null {
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
  const icon =
    typeof value.icon === 'string'
      ? value.icon
      : typeof value.image === 'string'
        ? value.image
        : undefined;
  const color =
    typeof value.color === 'string'
      ? value.color
      : typeof value.colour === 'string'
        ? value.colour
        : typeof value.textColor === 'string'
          ? value.textColor
          : undefined;
  return {
    nome,
    dimensao: parseDimension(value.dimensao ?? value.dimension ?? value.world ?? value.dim),
    x,
    z,
    y,
    descricao: descricao || undefined,
    icon,
    color,
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

/**
 * Combina o parse de cada arquivo da raiz. Qualquer `failed` vence:
 * um irmão `ok` (inclusive `isEnabled: false`) não mascara falha.
 */
export function combineMarkerFileResults(results: MarkerParseResult[]): MarkerParseResult {
  if (results.length === 0) {
    return { status: 'missing' };
  }

  const failed = results.find(
    (result): result is Extract<MarkerParseResult, { status: 'failed' }> =>
      result.status === 'failed',
  );
  if (failed) {
    return failed;
  }

  const markers = results.flatMap((result) => (result.status === 'ok' ? result.markers : []));
  return { status: 'ok', markers };
}

/**
 * Interpreta o texto de um arquivo de markers uNmINeD (sem executar JS).
 */
export function parseUnminedMarkersSource(source: string, fileName = 'markers'): MarkerParseResult {
  const trimmed = source.trim();
  if (!trimmed) {
    return { status: 'missing' };
  }

  let parsed: unknown = null;
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
    return { status: 'failed', error: `Não foi possível interpretar ${fileName}` };
  }

  if (isRecord(parsed) && 'isEnabled' in parsed) {
    if (parsed.isEnabled === false) {
      return { status: 'ok', markers: [] };
    }
    const list = Array.isArray(parsed.markers) ? parsed.markers : [];
    const markers: ParsedExportMarker[] = [];
    for (const item of list) {
      const marker = lookLikeMarker(item);
      if (marker) {
        markers.push({ ...marker, dimensao: 'overworld' });
      }
    }
    return { status: 'ok', markers };
  }

  const collected: ParsedExportMarker[] = [];
  collectMarkers(parsed, collected);
  return { status: 'ok', markers: collected };
}
