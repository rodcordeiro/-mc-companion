import { Directory, File } from 'expo-file-system';

import {
  isMarkerFileName,
  parseUnminedMarkersSource,
  type MarkerParseResult,
  type ParsedExportMarker,
} from '@/services/parse-markers-source';

export type { MarkerParseResult, ParsedExportMarker };

/**
 * Parser tolerante de markers do export uNmINeD (schema varia).
 * Só lê arquivos na raiz da Fonte — não desce em exports aninhados (ex.: nether/).
 */
export async function parseExportMarkers(root: Directory): Promise<MarkerParseResult> {
  const files: File[] = [];
  try {
    for (const item of root.list()) {
      if (item instanceof File && isMarkerFileName(item.name)) {
        files.push(item);
      }
    }
  } catch {
    return { status: 'missing' };
  }

  if (files.length === 0) {
    return { status: 'missing' };
  }

  const collected: ParsedExportMarker[] = [];
  let parseError: string | undefined;
  let sawEnabledFile = false;

  for (const file of files) {
    const text = await file.text();
    const parsed = parseUnminedMarkersSource(text, file.name);
    if (parsed.status === 'failed') {
      parseError = parsed.error;
      continue;
    }
    if (parsed.status === 'missing') {
      continue;
    }
    sawEnabledFile = true;
    collected.push(...parsed.markers);
  }

  if (collected.length === 0 && parseError && !sawEnabledFile) {
    return { status: 'failed', error: parseError };
  }

  return { status: 'ok', markers: collected };
}
