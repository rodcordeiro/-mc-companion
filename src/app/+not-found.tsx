import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Tela não encontrada.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar ao Mapa</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 18,
  },
  link: {
    marginTop: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  linkText: {
    color: colors.accent,
    fontSize: 16,
  },
});
