import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DIMENSIONS, dimensionLabel, type Dimension } from '@/domain/dimension';
import { colors, spacing } from '@/theme';

type Props = {
  selected: Dimension;
  availability: Record<Dimension, { available: boolean }>;
  onSelect: (dimension: Dimension) => void;
};

export function DimensionSelector({ selected, availability, onSelect }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist" accessibilityLabel="Dimensão">
      {DIMENSIONS.map((dimension) => {
        const enabled = availability[dimension]?.available ?? false;
        const isSelected = selected === dimension;
        return (
          <Pressable
            key={dimension}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled: !enabled }}
            accessibilityLabel={dimensionLabel(dimension)}
            disabled={!enabled}
            onPress={() => onSelect(dimension)}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              !enabled && styles.chipDisabled,
            ]}>
            <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected, !enabled && styles.chipLabelDisabled]}>
              {dimensionLabel(dimension)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  chip: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: colors.background,
  },
  chipLabelDisabled: {
    color: colors.muted,
  },
});
