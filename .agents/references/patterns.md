# Padrões locais (specs/ADRs)

Observados na documentação e no MVP em `src/`.

- Copy-on-import da Fonte de Mapa; original intocado (ADR 0003).
- Viewer Leaflet próprio; `expo-leaflet` fora da arquitetura (ADR 0002).
- Idempotência de importação: `dimension:round(x):round(z):slug(nome)` (ADR 0004).
- WebView recebe payload estruturado (`init` / `setDimension` / `setOverlay` / `centerOn`); não usa estado global implícito nem HTML do export como dono dos pins.
- Tiles do MVP vêm da cópia interna via file/HTML; HTTP `127.0.0.1` é pós-MVP.
- Origem do Marcador: boolean `imported`.
- Empty/error/CTA nativos fora da WebView.
- Câmera do Mapa não persiste entre sessões.

Não promover estes padrões a `domains/mobile` sem evidência de reuso em outro app.
