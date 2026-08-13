import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { useSettingsScreen } from '@/screens/settings/hooks/use-settings-screen';
import { colors, spacing } from '@/theme';

export function SettingsScreen() {
  const {
    mapSource,
    importPhase,
    importMessage,
    lastError,
    permissionDenied,
    requestImport,
    beginImport,
  } = useSettingsScreen();

  const busy = importPhase === 'validating' || importPhase === 'copying' || importPhase === 'importing-markers';
  const hasSource = Boolean(mapSource);

  let status = 'Nenhuma fonte de mapa.';
  if (busy) {
    status = importMessage;
  } else if (permissionDenied) {
    status = 'Sem acesso à pasta, o app não consegue importar o mapa.';
  } else if (importPhase === 'markers-failed') {
    status = 'Mapa importado. Não foi possível importar os marcadores.';
  } else if (importPhase === 'failed' && lastError) {
    status = lastError;
  } else if (hasSource) {
    status = 'Fonte de mapa importada.';
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Configuração</Text>
      <Text style={styles.status} accessibilityLiveRegion="polite">
        {status}
      </Text>
      {busy ? <ActivityIndicator color={colors.accent} /> : null}

      {!hasSource && !busy ? (
        <PrimaryButton
          label={permissionDenied ? 'Tentar novamente' : 'Selecionar pasta do export uNmINeD'}
          onPress={() => void beginImport('first')}
        />
      ) : null}

      {hasSource && !busy ? (
        <View style={styles.actions}>
          <Text style={styles.hint}>Use para um novo export do mesmo mundo. Não apaga marcadores.</Text>
          <PrimaryButton label="Atualizar mapa" onPress={() => requestImport('update')} />
          <PrimaryButton label="Substituir fonte de mapa" danger onPress={() => requestImport('replace')} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  status: {
    color: colors.text,
    fontSize: 16,
  },
  hint: {
    color: colors.muted,
    fontSize: 14,
  },
  actions: {
    gap: spacing.md,
  },
});
