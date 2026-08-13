import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { dimensionLabel } from '@/domain/dimension';
import type { Marker } from '@/domain/marker';
import { MarkerForm } from '@/screens/markers/marker-form';
import { useMarkersScreen } from '@/screens/markers/hooks/use-markers-screen';
import { colors, spacing } from '@/theme';

export function MarkersScreen() {
  const {
    ready,
    sorted,
    saveMarker,
    deleteMarker,
    focusMarkerOnMap,
    formErrors,
    clearFormErrors,
  } = useMarkersScreen();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Marker | null>(null);

  if (!ready) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Carregando marcadores…</Text>
      </View>
    );
  }

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    clearFormErrors();
  };

  const confirmDelete = (marker: Marker) => {
    Alert.alert('Excluir este marcador?', marker.nome, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteMarker(marker.id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      {sorted.length === 0 ? (
        <EmptyState
          title="Nenhum marcador ainda."
          description="Adicione aqui ou importe um export uNmINeD em Configuração."
          actionLabel="Adicionar marcador"
          onAction={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        />
      ) : (
        <>
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.meta}>{dimensionLabel(item.dimensao)}</Text>
                <Text style={styles.meta}>
                  X {Math.round(item.x)} / Z {Math.round(item.z)}
                </Text>
                <View style={styles.actions}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Ver no mapa" onPress={() => focusMarkerOnMap(item)} style={styles.action}>
                    <Text style={styles.actionLabel}>Ver no mapa</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Editar"
                    onPress={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                    style={styles.action}>
                    <Text style={styles.actionLabel}>Editar</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Excluir" onPress={() => confirmDelete(item)} style={styles.action}>
                    <Text style={[styles.actionLabel, styles.danger]}>Excluir</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
          <View style={styles.footer}>
            <PrimaryButton
              label="Adicionar marcador"
              onPress={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            />
          </View>
        </>
      )}
      <MarkerForm
        visible={formOpen}
        marker={editing}
        errors={formErrors}
        onSave={saveMarker}
        onCancel={closeForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  action: {
    minHeight: 48,
    justifyContent: 'center',
  },
  actionLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
  danger: {
    color: colors.danger,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  muted: {
    color: colors.muted,
  },
});
