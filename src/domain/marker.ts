import type { Dimension } from '@/domain/dimension';

export type Marker = {
  id: string;
  nome: string;
  dimensao: Dimension;
  x: number;
  z: number;
  y?: number;
  descricao?: string;
  tags?: string;
  /** Distingue importado vs alta manual. Nome de enum público permanece TBD. */
  imported: boolean;
  icon?: string;
  color?: string;
  updatedAt: string;
};

export type MarkerDraft = {
  nome: string;
  dimensao: Dimension;
  x: string;
  z: string;
  y?: string;
  descricao?: string;
  tags?: string;
};
