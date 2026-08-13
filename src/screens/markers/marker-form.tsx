import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { DIMENSIONS, dimensionLabel } from '@/domain/dimension';
import type { Marker, MarkerDraft } from '@/domain/marker';
import { colors, spacing } from '@/theme';

type Props = {
  visible: boolean;
  marker?: Marker | null;
  errors: Partial<Record<keyof MarkerDraft, string>>;
  onSave: (draft: MarkerDraft, existingId?: string) => string | null;
  onCancel: () => void;
};

const EMPTY: MarkerDraft = {
  nome: '',
  dimensao: 'overworld',
  x: '',
  z: '',
  y: '',
  descricao: '',
  tags: '',
};

export function MarkerForm({ visible, marker, errors, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<MarkerDraft>(EMPTY);

  const openKey = visible ? marker?.id ?? 'new' : 'closed';
  const [lastKey, setLastKey] = useState(openKey);
  if (openKey !== lastKey) {
    setLastKey(openKey);
    setDraft(
      marker
        ? {
            nome: marker.nome,
            dimensao: marker.dimensao,
            x: String(marker.x),
            z: String(marker.z),
            y: marker.y != null ? String(marker.y) : '',
            descricao: marker.descricao ?? '',
            tags: marker.tags ?? '',
          }
        : EMPTY,
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{marker ? 'Editar marcador' : 'Adicionar marcador'}</Text>
        <Field label="Nome" error={errors.nome} value={draft.nome} onChange={(nome) => setDraft({ ...draft, nome })} />
        <Text style={styles.label}>Dimensão</Text>
        <View style={styles.dims}>
          {DIMENSIONS.map((dimension) => (
            <Pressable
              key={dimension}
              accessibilityRole="button"
              accessibilityLabel={dimensionLabel(dimension)}
              onPress={() => setDraft({ ...draft, dimensao: dimension })}
              style={[styles.dim, draft.dimensao === dimension && styles.dimSelected]}>
              <Text style={[styles.dimLabel, draft.dimensao === dimension && styles.dimLabelSelected]}>
                {dimensionLabel(dimension)}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.dimensao ? <Text style={styles.error}>{errors.dimensao}</Text> : null}
        <View style={styles.row}>
          <View style={styles.flex}>
            <Field label="X" error={errors.x} value={draft.x} onChange={(x) => setDraft({ ...draft, x })} keyboardType="decimal-pad" />
          </View>
          <View style={styles.flex}>
            <Field label="Z" error={errors.z} value={draft.z} onChange={(z) => setDraft({ ...draft, z })} keyboardType="decimal-pad" />
          </View>
        </View>
        <Field label="Y (opcional)" value={draft.y ?? ''} onChange={(y) => setDraft({ ...draft, y })} keyboardType="decimal-pad" />
        <Field label="Descrição" value={draft.descricao ?? ''} onChange={(descricao) => setDraft({ ...draft, descricao })} multiline />
        <Field label="Tags" value={draft.tags ?? ''} onChange={(tags) => setDraft({ ...draft, tags })} />
        <PrimaryButton label="Salvar" onPress={() => {
          const id = onSave(draft, marker?.id);
          if (id) {
            onCancel();
          }
        }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Cancelar" onPress={onCancel} style={styles.cancel}>
          <Text style={styles.cancelLabel}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  keyboardType?: 'decimal-pad';
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor={colors.muted}
        style={[styles.input, multiline && styles.multiline]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingVertical: spacing.sm,
  },
  error: {
    color: colors.danger,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  dims: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dim: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dimLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  dimLabelSelected: {
    color: colors.background,
  },
  cancel: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    color: colors.muted,
    fontSize: 16,
  },
});
