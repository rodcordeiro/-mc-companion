/**
 * Converte literais JS frouxos (aspas simples, trailing comma) em JSON.
 */
export function parseLooseJsObject(source: string): unknown {
  const start = source.indexOf('{');
  const end = source.lastIndexOf('}');
  if (start < 0 || end <= start) {
    throw new Error('Objeto JS não encontrado');
  }

  let body = source.slice(start, end + 1);
  body = body.replace(/\/\*[\s\S]*?\*\//g, '');
  body = body.replace(/\/\/.*$/gm, '');
  body = body.replace(/'([^'\\]|\\.)*'/g, (match) => `"${match.slice(1, -1).replace(/"/g, '\\"')}"`);
  body = body.replace(/([,{[]\s*)([A-Za-z_][\w]*)\s*:/g, '$1"$2":');
  body = body.replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(body);
}

export function tryParseLooseJsObject(source: string): unknown | null {
  try {
    return parseLooseJsObject(source);
  } catch {
    return null;
  }
}
