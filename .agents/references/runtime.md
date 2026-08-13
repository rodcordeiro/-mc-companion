# Runtime

Não há bootstrap no checkout. Sem Expo Router, sem DI, sem static server, sem WebView.

Alvo (ADRs 0001–0002, spec `docs/specs/viewer-e-fonte-de-mapa.md`):

- App Expo Android.
- Home = tela Mapa; viewer Leaflet em WebView própria (HTML/JS local).
- Tiles da Fonte de Mapa (cópia interna); static server `127.0.0.1` preferido; file/HTML como fallback.
- Marcadores no storage do app; overlay enviado por payload, não pelo HTML do export.

Biblioteca, porta e ciclo de vida do server: TBD de implementação. Se exigir nativo incompatível com Expo managed, reavaliar ADR 0001.
