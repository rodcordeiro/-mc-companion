import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import type { Dimension } from '@/domain/dimension';
import type { MapSource } from '@/domain/map-source';
import type { Marker } from '@/domain/marker';
import type { MapFocusCommand } from '@/state/app-provider';
import { buildViewerHtml } from '@/viewer/html';

type Props = {
  mapSource: MapSource;
  markers: Marker[];
  dimension: Dimension;
  focus: MapFocusCommand | null;
  onMarkerPress: (id: string) => void;
  onReady: () => void;
  onError: () => void;
  onFocusApplied?: () => void;
};

type ViewerMessage =
  | { type: 'ready' }
  | { type: 'markerPress'; id: string }
  | { type: 'emptyTap' }
  | { type: 'error'; message?: string };

function toOverlay(markers: Marker[]) {
  return markers.map((marker) => ({
    id: marker.id,
    nome: marker.nome,
    dimensao: marker.dimensao,
    x: marker.x,
    z: marker.z,
  }));
}

export function MapViewer({ mapSource, markers, dimension, focus, onMarkerPress, onReady, onError, onFocusApplied }: Props) {
  const webRef = useRef<WebView>(null);
  const [html, setHtml] = useState<string | null>(null);
  const viewerReady = useRef(false);

  useEffect(() => {
    let cancelled = false;
    buildViewerHtml()
      .then((value) => {
        if (!cancelled) {
          setHtml(value);
        }
      })
      .catch(() => {
        if (!cancelled) {
          onError();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [onError]);

  const initPayload = useMemo(() => ({
    type: 'init',
    tileBaseUrl: mapSource.directoryUri,
    dimension,
    metadata: mapSource.metadata,
    overlay: toOverlay(markers),
    centerX: mapSource.metadata.centerX,
    centerZ: mapSource.metadata.centerZ,
  }), [dimension, mapSource, markers]);

  const send = useCallback((payload: unknown) => {
    const raw = JSON.stringify(payload);
    webRef.current?.postMessage(raw);
    webRef.current?.injectJavaScript(
      `window.__MC_COMPANION_VIEWER__ && window.__MC_COMPANION_VIEWER__(${raw}); true;`,
    );
  }, []);

  useEffect(() => {
    if (!viewerReady.current) {
      return;
    }
    send({ type: 'setDimension', dimension, overlay: toOverlay(markers) });
  }, [dimension, markers, send]);

  useEffect(() => {
    if (!viewerReady.current || !focus) {
      return;
    }
    send({
      type: 'centerOn',
      dimension: focus.dimension,
      x: focus.x,
      z: focus.z,
      overlay: toOverlay(markers),
    });
    onFocusApplied?.();
  }, [focus, markers, send]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    let message: ViewerMessage | null = null;
    try {
      message = JSON.parse(event.nativeEvent.data) as ViewerMessage;
    } catch {
      return;
    }
    if (message.type === 'ready') {
      viewerReady.current = true;
      send(initPayload);
      if (focus) {
        send({
          type: 'centerOn',
          dimension: focus.dimension,
          x: focus.x,
          z: focus.z,
          overlay: toOverlay(markers),
        });
        onFocusApplied?.();
      }
      onReady();
      return;
    }
    if (message.type === 'markerPress' && message.id) {
      onMarkerPress(message.id);
    }
  }, [initPayload, onMarkerPress, onReady, send]);

  if (!html) {
    return <View style={styles.fill} />;
  }

  return (
    <WebView
      ref={webRef}
      source={{ html, baseUrl: mapSource.directoryUri }}
      originWhitelist={['*', 'file://*']}
      allowFileAccess
      allowFileAccessFromFileURLs
      allowingReadAccessToURL={mapSource.directoryUri}
      mixedContentMode="always"
      javaScriptEnabled
      setSupportMultipleWindows={false}
      onMessage={onMessage}
      onError={onError}
      style={styles.fill}
      accessibilityLabel="Mapa do mundo. Use a aba Marcadores para a lista."
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
