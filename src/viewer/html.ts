import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';

import { VIEWER_BOOTSTRAP } from '@/viewer/bootstrap';

async function loadLeafletJs(): Promise<string> {
  const asset = Asset.fromModule(require('../../assets/viewer/leaflet.min.js.txt'));
  await asset.downloadAsync();
  if (!asset.localUri) {
    throw new Error('Leaflet local indisponível');
  }
  return new File(asset.localUri).text();
}

/**
 * Monta o HTML local do viewer (Leaflet vendorizado + bootstrap). Sem CDN.
 */
export async function buildViewerHtml(): Promise<string> {
  const leaflet = await loadLeafletJs();
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; background: #121212; }
      .leaflet-container { background: #121212; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>${leaflet}</script>
    <script>${VIEWER_BOOTSTRAP}</script>
  </body>
</html>`;
}
