import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { DimensionSelector } from '@/screens/map/dimension-selector';
import { MapViewer } from '@/screens/map/map-viewer';
import { MarkerDetailSheet } from '@/screens/map/marker-detail-sheet';
import { useMapScreen } from '@/screens/map/hooks/use-map-screen';
import { colors, spacing } from '@/theme';

export function MapScreen() {
  const {
    ready,
    mapSource,
    markers,
    selectedDimension,
    setSelectedDimension,
    mapFocus,
    consumeMapFocus,
    availability,
    goToSettings,
  } = useMapScreen();
  const [loading, setLoading] = useState(true);
  const [viewerError, setViewerError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.muted}>Carregando mapa…</Text>
      </View>
    );
  }

  if (!mapSource) {
    return (
      <EmptyState
        title="Nenhuma fonte de mapa importada."
        actionLabel="Importar export uNmINeD"
        onAction={goToSettings}
        accessibilityLabel="Nenhuma fonte de mapa importada."
      />
    );
  }

  if (viewerError) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Não foi possível abrir o mapa.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Ver configuração" onPress={goToSettings} style={styles.link}>
          <Text style={styles.linkLabel}>Ver configuração</Text>
        </Pressable>
      </View>
    );
  }

  const selected = markers.find((marker) => marker.id === selectedId) ?? null;

  return (
    <View style={styles.screen}>
      <DimensionSelector
        selected={selectedDimension}
        availability={availability}
        onSelect={setSelectedDimension}
      />
      <View style={styles.viewer}>
        {loading ? (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.muted}>Carregando mapa…</Text>
          </View>
        ) : null}
        <MapViewer
          mapSource={mapSource}
          markers={markers}
          dimension={selectedDimension}
          focus={mapFocus}
          onMarkerPress={setSelectedId}
          onReady={() => setLoading(false)}
          onFocusApplied={consumeMapFocus}
          onError={() => {
            setLoading(false);
            setViewerError(true);
          }}
        />
      </View>
      <MarkerDetailSheet marker={selected} onClose={() => setSelectedId(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewer: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    zIndex: 2,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
  muted: {
    color: colors.muted,
    fontSize: 16,
  },
  link: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});
