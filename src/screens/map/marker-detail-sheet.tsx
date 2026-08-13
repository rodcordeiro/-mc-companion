import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { dimensionLabel } from '@/domain/dimension';
import type { Marker } from '@/domain/marker';
import { colors, spacing } from '@/theme';

type Props = {
  marker: Marker | null;
  onClose: () => void;
};

export function MarkerDetailSheet({ marker, onClose }: Props) {
  return (
    <Modal visible={Boolean(marker)} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar detalhes">
        <Pressable style={styles.sheet} onPress={() => undefined}>
          {marker ? (
            <>
              <Text style={styles.title}>{marker.nome}</Text>
              <Text style={styles.meta}>{dimensionLabel(marker.dimensao)}</Text>
              <Text style={styles.meta}>
                X {Math.round(marker.x)} / Z {Math.round(marker.z)}
                {marker.y != null ? ` / Y ${Math.round(marker.y)}` : ''}
              </Text>
              {marker.descricao ? <Text style={styles.body}>{marker.descricao}</Text> : null}
              {marker.tags ? <Text style={styles.body}>{marker.tags}</Text> : null}
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} style={styles.close}>
                <Text style={styles.closeLabel}>Fechar</Text>
              </Pressable>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 16,
  },
  body: {
    color: colors.text,
    fontSize: 16,
  },
  close: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  closeLabel: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});
