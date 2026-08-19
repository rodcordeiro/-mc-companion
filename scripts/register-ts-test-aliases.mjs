import module from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const srcRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

function toFileUrl(filePath) {
  const withTs = filePath.endsWith('.ts') ? filePath : `${filePath}.ts`;
  return pathToFileURL(withTs).href;
}

module.registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(toFileUrl(path.join(srcRoot, specifier.slice(2))), context);
    }
    if (
      context.parentURL &&
      specifier.startsWith('.') &&
      !path.extname(specifier) &&
      context.parentURL.includes('-mc-companion')
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
