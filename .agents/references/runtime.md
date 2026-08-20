# Runtime

App Expo SDK 57, Android first. Entry: `expo-router/entry`. Rotas em `src/app/`.

Desenvolvimento no device: **development build** (`expo-dev-client`), não Expo Go. Tiles `file://` na WebView e o picker SAF precisam do binário do app.

```text
pnpm start          # Metro para o dev client
pnpm android        # abre o Metro no Android (exige APK de development instalado)
pnpm typecheck      # tsc --noEmit
pnpm test           # node:test nos parsers/tile URLs
```

Primeira vez no aparelho:

1. Secret `EXPO_TOKEN` no GitHub Actions (conta Expo `rodcordeiro`).
2. Build: `eas build --platform android --profile development` (ou push em `develop`; CI mapeia `develop` → canal/perfil `development`, `main` → `production`).
3. Instalar o APK interno e então `pnpm start`. O launcher do dev client conecta no Metro.

`android/` e `ios/` não entram no git (CNG no EAS). Production (`eas.json` perfil `production`) **não** inclui o launcher do dev client.

Pacotes nativos Expo devem seguir o SDK (`pnpm expo install <pkg>` / `pnpm expo install --fix`). `expo-file-system` no SDK 57 é `~57.0.x`, não `19.x` — a 19.x ainda referencia `FilePermissionModuleInterface`, removida do `expo-modules-core` 57, e o APK crasha no `MainApplication.onCreate`.

- Home = Mapa (`src/app/index.tsx` → `src/screens/map`).
- Viewer Leaflet em WebView (`src/viewer` + Leaflet vendorizado). Sem `expo-leaflet`.
- Tiles da cópia interna via `file://` + `baseUrl` (MVP). Static server HTTP `127.0.0.1` é pós-MVP; nativo extra exigiria reavaliar ADR 0001.
- Marcadores em `documentDirectory/markers.json`; meta da Fonte em `app-meta.json`; cópias em `maps/<id>/`.
- Seleção de pasta: `Directory.pickDirectoryAsync()` (SAF).
