import { Directory, File } from 'expo-file-system';

import {
  combineMarkerFileResults,
  isMarkerFileName,
  parseUnminedMarkersSource,
  type MarkerParseResult,
} from '@/services/parse-markers-source';

export type { MarkerParseResult, ParsedExportMarker } from '@/services/parse-markers-source';

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
    return {
      status: 'failed',
      error: 'Não foi possível ler os arquivos de marcadores da Fonte',
    };
  }

  if (files.length === 0) {
    return { status: 'missing' };
  }

  const results: MarkerParseResult[] = [];
  for (const file of files) {
    try {
      const text = await file.text();
      results.push(parseUnminedMarkersSource(text, file.name));
    } catch {
      results.push({
        status: 'failed',
        error: `Não foi possível interpretar ${file.name}`,
      });
    }
  }

  return combineMarkerFileResults(results);
}
