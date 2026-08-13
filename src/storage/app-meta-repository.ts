import type { AppMeta } from '@/domain/map-source';
import { readJsonFile, writeJsonFile } from '@/storage/json-store';
import { appMetaFile } from '@/storage/paths';

const EMPTY_META: AppMeta = {
  activeMapId: null,
  lastImportPhase: 'idle',
  mapSource: null,
};

export async function loadAppMeta(): Promise<AppMeta> {
  return readJsonFile<AppMeta>(appMetaFile(), EMPTY_META);
}

export async function saveAppMeta(meta: AppMeta): Promise<void> {
  await writeJsonFile(appMetaFile(), meta);
}
