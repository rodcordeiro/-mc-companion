/**
 * Slug da chave de idempotência (ADR 0004): nome normalizado sem acento.
 */
export function slugNome(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

/**
 * Chave `<dimension>:<round(x)>:<round(z)>:<slug(nome)>`.
 */
export function markerIdempotencyKey(input: {
  dimensao: string;
  x: number;
  z: number;
  nome: string;
}): string {
  return `${input.dimensao}:${Math.round(input.x)}:${Math.round(input.z)}:${slugNome(input.nome)}`;
}
