import { File } from 'expo-file-system';

export async function readJsonFile<T>(file: File, fallback: T): Promise<T> {
  if (!file.exists) {
    return fallback;
  }
  const text = await file.text();
  if (!text.trim()) {
    return fallback;
  }
  return JSON.parse(text) as T;
}

export async function writeJsonFile(file: File, value: unknown): Promise<void> {
  const parent = file.parentDirectory;
  if (parent && !parent.exists) {
    parent.create();
  }
  if (!file.exists) {
    file.create();
  }
  file.write(JSON.stringify(value));
}
