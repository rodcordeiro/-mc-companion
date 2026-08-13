import { Directory, File } from 'expo-file-system';

/**
 * Tamanho da pasta quando a API expõe `size`; senão null (sem dialog de confirmação).
 */
export function measureDirectorySize(dir: Directory): number | null {
  if (typeof dir.size === 'number' && Number.isFinite(dir.size) && dir.size > 0) {
    return dir.size;
  }
  try {
    const listed = dir.list();
    let total = 0;
    for (const item of listed) {
      if (item instanceof Directory) {
        const nested = measureDirectorySize(item);
        if (nested == null) {
          return null;
        }
        total += nested;
      } else if (item instanceof File) {
        const size = item.size;
        if (typeof size !== 'number' || !Number.isFinite(size)) {
          return null;
        }
        total += size;
      }
    }
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1).replace('.', ',')} KB`;
  }
  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(1).replace('.', ',')} MB`;
  }
  const gb = mb / 1024;
  return `${gb.toFixed(2).replace('.', ',')} GB`;
}

export function isInsufficientSpaceError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /enospc|no space|espaço|space left|disk full|ENOSPC/i.test(message);
}

export function isPermissionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /permission|acesso|EACCES|denied|security/i.test(message);
}
