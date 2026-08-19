export type UnminedTileCoords = {
  zoom: number;
  tileX: number;
  tileY: number;
  imageFormat: string;
};

/**
 * Caminho relativo uNmINeD: tiles/zoom.{z}/{xd}/{yd}/tile.{x}.{y}.{format}
 */
export function unminedTileRelativePath(input: UnminedTileCoords): string {
  const format = input.imageFormat.replace(/^\./, '') || 'png';
  const xd = Math.floor(input.tileX / 10);
  const yd = Math.floor(input.tileY / 10);
  return `zoom.${input.zoom}/${xd}/${yd}/tile.${input.tileX}.${input.tileY}.${format}`;
}

export function unminedTileUrl(
  input: UnminedTileCoords & {
    baseUrl: string;
    tilePath: string;
  },
): string {
  const base = input.baseUrl.endsWith('/') ? input.baseUrl : `${input.baseUrl}/`;
  const folder = input.tilePath.endsWith('/') ? input.tilePath : `${input.tilePath}/`;
  return `${base}${folder}${unminedTileRelativePath(input)}`;
}
