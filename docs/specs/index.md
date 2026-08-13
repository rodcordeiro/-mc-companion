# Specs — MC Companion

Recorte funcional: [`docs/product-brief.md`](../product-brief.md).  
Glossário: [`CONTEXT.md`](../../CONTEXT.md).  
Esta pasta decompõe o MVP fechado. Grill de produto encerrado (2026-08-13). Pontos abertos restantes são implementação ou Pencil. Hipóteses estão marcadas. Rotas/Eixos da ferrovia estão fechados como **fora do MVP**.

## Design (Pencil)

Canvas canônico do wireframe: [`docs/design.pen`](../design.pen).

**Bloqueio:** o wireframe **não pode ser desenhado** até o Pencil MCP (`user-highagency.pencildev-extension-pencil`) estar habilitado. Não substituir o `.pen` por formato inventado. Até lá, a IA textual vive nestas specs.

## Fontes fechadas

- [`ADR 0001`](../adr/0001-expo-android-first.md) — Expo / React Native, Android only
- [`ADR 0002`](../adr/0002-custom-leaflet-webview.md) — Leaflet em WebView própria; sem `expo-leaflet` como dependência arquitetural
- [`ADR 0003`](../adr/0003-unmined-export-imported-to-app-storage.md) — copy-on-import para storage do app
- [`ADR 0004`](../adr/0004-marker-idempotency.md) — chave `dimension + round(x) + round(z) + slug(nome)`

## Mapa das specs

| Spec | Status | Conteúdo |
| --- | --- | --- |
| [navegacao.md](./navegacao.md) | Fechado | Três destinos; Home = Mapa; first-run empty + CTA |
| [tela-mapa.md](./tela-mapa.md) | Fechado | Tiles, overlay, seletor de Dimensão; sem alta no mapa |
| [tela-marcadores.md](./tela-marcadores.md) | Fechado | Lista única, ordem Dimensão depois nome, alta/edição/exclusão |
| [tela-configuracao.md](./tela-configuracao.md) | Fechado | Seleção, status, Atualizar mapa e Substituir fonte |
| [importacao.md](./importacao.md) | Fechado | Copy-on-import; Atualizar = merge; Substituir = wipe |
| [modelo-marcador.md](./modelo-marcador.md) | Fechado | Campos e chave de idempotência |
| [viewer-e-fonte-de-mapa.md](./viewer-e-fonte-de-mapa.md) | Fechado (com TBD) | Contrato app ↔ WebView ↔ Fonte de Mapa |
| [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md) | Pós-MVP | Origem+destino; overlay no Mapa; pool PT misturado; Hub se via ≤ 2× |

## Glossário — rotas (fechado)

**Rotas fora do MVP.** São a ferrovia do mundo (Rota + Eixos), não overlay do mapa no recorte atual. Definições em [`CONTEXT.md`](../../CONTEXT.md). Detalhe e precedente: [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md).

## TBD (não inventar regra)

Nenhum TBD de produto aberto neste recorte. Restante: implementação (schema uNmINeD, bridge WebView, nome do campo origem) e Pencil MCP para o wireframe.

## Fora do MVP

iOS; Rotas e Eixos da ferrovia; multi-world; edição do mundo Minecraft; parser Bedrock; renderer próprio de chunks; sync cloud; multiplayer em tempo real.

## Notas de QA

Aceite do MVP no Android (ainda sem suíte automatizada):

- Importação de um export uNmINeD pequeno para storage interno
- Renderização dos tiles do Overworld na home, sem a pasta original
- Overlay de marcadores e toque para detalhes
- Atualizar mapa: tiles novos, merge de marcadores sem duplicar (ADR 0004); manuais permanecem
- Substituir fonte apaga todos os Marcadores; o novo export pode importar os seus
- Reinício mantendo mapa e marcadores
- Lista de Marcadores sem filtro de Dimensão (Dimensão visível em cada item)
- Aviso de tamanho do export quando conhecido; disco cheio via erro do SO
- Atualizar/Substituir: apaga a cópia antiga no disco só depois da nova válida
- Falha só de marcadores: mapa fica; lista só muda se o passo de marcadores concluir; sem retry só de markers
- Cold start do Mapa: Overworld; câmera não persiste
- Lista de Marcadores: Overworld → Nether → End, depois nome A–Z
- Fluidez do mapa no Android (medir antes de otimizar)

TBD sem Given/When/Then: implementação (schema uNmINeD, bridge) e Pencil MCP.

## Hipótese visual

**Hipótese (não é marca):** companion Minecraft, Android, map-first, dark-friendly.
