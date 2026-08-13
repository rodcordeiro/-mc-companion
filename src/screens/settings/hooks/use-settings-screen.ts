import { useEffect } from 'react';
import { Alert } from 'react-native';

import { useAppState } from '@/state/app-provider';
import type { ImportMode } from '@/services/import-map';

export function useSettingsScreen() {
  const state = useAppState();

  useEffect(() => {
    if (!state.sizeConfirm) {
      return;
    }
    Alert.alert(
      'Confirmar importação',
      `Este export tem cerca de ${state.sizeConfirm.label}. Continuar a importação?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: state.cancelSizeImport },
        { text: 'Continuar', onPress: () => void state.confirmSizeImport() },
      ],
    );
  }, [state.sizeConfirm, state.cancelSizeImport, state.confirmSizeImport]);

  const requestImport = (mode: ImportMode) => {
    if (mode === 'replace') {
      Alert.alert(
        'Substituir fonte',
        'Substituir a fonte de mapa apaga todos os marcadores. Continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => void state.beginImport('replace') },
        ],
      );
      return;
    }
    void state.beginImport(mode);
  };

  return { ...state, requestImport };
}
