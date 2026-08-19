/**
 * Converte literais JS frouxos (aspas simples, trailing comma, new Array()) em JSON.
 */
export function parseLooseJsObject(source: string): unknown {
  const stripped = stripJsComments(source).replace(/\bnew\s+Array\s*\(\s*\)/g, '[]');
  const literal = extractFirstObjectLiteral(stripped);
  if (!literal) {
    throw new Error('Objeto JS não encontrado');
  }

  let body = literal;
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

function stripJsComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function extractFirstObjectLiteral(source: string): string | null {
  const start = source.indexOf('{');
  if (start < 0) {
    return null;
  }

  let depth = 0;
  let inString: '"' | "'" | null = null;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (char === '\\') {
        index += 1;
        continue;
      }
      if (char === inString) {
        inString = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      inString = char;
      continue;
    }
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }
  return null;
}
