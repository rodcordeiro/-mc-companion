export const DIMENSIONS = ['overworld', 'nether', 'end'] as const;

export type Dimension = (typeof DIMENSIONS)[number];

const LABELS: Record<Dimension, string> = {
  overworld: 'Overworld',
  nether: 'Nether',
  end: 'End',
};

/**
 * Rótulo de UI em pt-BR para uma Dimensão do Minecraft.
 */
export function dimensionLabel(dimension: Dimension): string {
  return LABELS[dimension];
}

/**
 * Ordem canônica da lista de Marcadores: Overworld → Nether → End.
 */
export function dimensionSortIndex(dimension: Dimension): number {
  return DIMENSIONS.indexOf(dimension);
}

/**
 * Interpreta texto de export/UI como Dimensão; default Overworld.
 */
export function parseDimension(value: unknown): Dimension {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^minecraft:/, '');

  if (normalized === 'nether' || normalized === 'the_nether' || normalized === 'dim-1' || normalized === '-1') {
    return 'nether';
  }
  if (normalized === 'end' || normalized === 'the_end' || normalized === 'dim1' || normalized === '1') {
    return 'end';
  }
  return 'overworld';
}
