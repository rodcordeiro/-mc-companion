# Runtime

App Expo SDK 57, Android first. Entry: `expo-router/entry`. Rotas em `src/app/`.

```text
pnpm start          # Metro
pnpm android        # device/emulator Android
pnpm typecheck      # tsc --noEmit
pnpm test           # node:test nos parsers/tile URLs
```

- Home = Mapa (`src/app/index.tsx` → `src/screens/map`).
- Viewer Leaflet em WebView (`src/viewer` + Leaflet vendorizado). Sem `expo-leaflet`.
- Tiles da cópia interna via `file://` + `baseUrl` (MVP). Static server HTTP `127.0.0.1` é pós-MVP; nativo extra exigiria reavaliar ADR 0001.
- Marcadores em `documentDirectory/markers.json`; meta da Fonte em `app-meta.json`; cópias em `maps/<id>/`.
- Seleção de pasta: `Directory.pickDirectoryAsync()` (SAF).
