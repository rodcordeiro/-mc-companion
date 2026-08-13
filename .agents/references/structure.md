# Estrutura (checkout real)

Inventário em 2026-08-13. Sem `README.md`, sem `package.json`, sem `src/`, sem lockfile. **Não é um repositório git** neste path.

```text
AGENTS.md
CONTEXT.md
docs/
  product-brief.md
  design.pen
  adr/
    0001-expo-android-first.md
    0002-custom-leaflet-webview.md
    0003-unmined-export-imported-to-app-storage.md
    0004-marker-idempotency.md
  specs/
    index.md
    navegacao.md
    tela-mapa.md
    tela-marcadores.md
    tela-configuracao.md
    importacao.md
    modelo-marcador.md
    viewer-e-fonte-de-mapa.md
    pos-mvp-ferrovia.md
.agents/references/   # este conjunto
```

Layout Expo esperado pelo guideline (`src/app/`, `src/screens/`, `assets/`) **não existe**. Débito em [tech-debt.md](./tech-debt.md).
