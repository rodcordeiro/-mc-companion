import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { colors, spacing } from '@/theme';

type Props = {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  accessibilityLabel?: string;
};

export function EmptyState({ title, description, actionLabel, onAction, accessibilityLabel }: Props) {
  return (
    <View style={styles.wrap} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      <PrimaryButton label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
