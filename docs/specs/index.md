# Specs — MC Companion

Recorte funcional: [`docs/product-brief.md`](../product-brief.md).  
Glossário: [`CONTEXT.md`](../../CONTEXT.md).  
Esta pasta decompõe o MVP fechado. Grill de produto encerrado (2026-08-13). Alinhamento docs↔código (2026-08-19): tiles do MVP via file/HTML da cópia interna; envelope da bridge fechado como implementado; origem do Marcador = boolean `imported`. Rotas/Eixos da ferrovia permanecem **fora do MVP**. Hipóteses visuais estão marcadas.

## Design (Pencil)

Canvas canônico do wireframe: [`docs/design.pen`](../design.pen). Só editar via Pencil MCP. O canvas ainda não foi desenhado; a IA textual destas specs continua a fonte de produto até o wireframe existir. Não substituir o `.pen` por formato inventado.

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
| [importacao.md](./importacao.md) | Fechado | Copy-on-import; Atualizar = merge; Substituir = wipe condicional; tiles via file/HTML |
| [modelo-marcador.md](./modelo-marcador.md) | Fechado | Campos, chave de idempotência, origem `imported` |
| [viewer-e-fonte-de-mapa.md](./viewer-e-fonte-de-mapa.md) | Fechado | Contrato app ↔ WebView; tiles file/HTML no MVP; HTTP 127.0.0.1 pós-MVP |
| [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md) | Pós-MVP | Origem+destino; overlay no Mapa; pool PT misturado; Hub se via ≤ 2× |

## Glossário — rotas (fechado)

**Rotas fora do MVP.** São a ferrovia do mundo (Rota + Eixos), não overlay do mapa no recorte atual. Definições em [`CONTEXT.md`](../../CONTEXT.md). Detalhe e precedente: [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md).

## Decisões de implementação (2026-08-19)

Fechadas no alinhamento docs↔código; detalhe em [viewer-e-fonte-de-mapa.md](./viewer-e-fonte-de-mapa.md) e [modelo-marcador.md](./modelo-marcador.md).

- Tiles do MVP: file/HTML da cópia interna. HTTP `127.0.0.1` é pós-MVP.
- Bridge: `init` / `setDimension` / `setOverlay` / `centerOn` (app→viewer) e `ready` / `markerPress` / `emptyTap` / `error` (viewer→app). Overlay mínimo: `id`, `nome`, `dimensao`, `x`, `z`.
- Origem do Marcador: boolean `imported`.
- Metadados do mapa: parse nativo de `unmined.map.properties.js`; o viewer não lê o JS do export.
- Costura de teste preferida: comportamento externo da importação (validar → copiar → trocar Fonte → marcadores) e das mensagens do viewer. Sem assertar HTML interno.

## TBD (não inventar regra)

Nenhum TBD de produto aberto neste recorte. Schema de export real fechado como evidência ([Inspect real uNmINeD export markers and tiles](https://github.com/rodcordeiro/-mc-companion/issues/4)); parser e tile URLs ainda não batem. Smoke no Android — mapa [Wayfinder: MVP smoke path after spec alignment](https://github.com/rodcordeiro/-mc-companion/issues/2). Wireframe Pencil e higiene (README, lint, testes) ficam para depois.

## Fora do MVP

iOS; Rotas e Eixos da ferrovia; multi-world; edição do mundo Minecraft; parser Bedrock; renderer próprio de chunks; sync cloud; multiplayer em tempo real; static server HTTP em `127.0.0.1` (o MVP lê a cópia interna via file/HTML).

## Notas de QA

Aceite do MVP no Android (ainda sem suíte automatizada):

- Importação de um export uNmINeD pequeno para storage interno
- Renderização dos tiles do Overworld na home, sem a pasta original
- Overlay de marcadores e toque para detalhes
- Atualizar mapa: tiles novos, merge de marcadores sem duplicar (ADR 0004); manuais permanecem
- Substituir fonte apaga todos os Marcadores **só se o passo de marcadores concluir**; o novo export pode importar os seus
- Reinício mantendo mapa e marcadores
- Lista de Marcadores sem filtro de Dimensão (Dimensão visível em cada item)
- Aviso de tamanho do export quando conhecido; disco cheio via erro do SO
- Atualizar/Substituir: apaga a cópia antiga no disco só depois da nova válida
- Falha só de marcadores: mapa fica; lista só muda se o passo de marcadores concluir; sem retry só de markers
- Cold start do Mapa: Overworld; câmera não persiste
- Lista de Marcadores: Overworld → Nether → End, depois nome A–Z
- Fluidez do mapa no Android (medir antes de otimizar)

Sem GWT nesta pasta: confirmar arquivos reais do uNmINeD; smoke no device; Pencil.

## Hipótese visual

**Hipótese (não é marca):** companion Minecraft, Android, map-first, dark-friendly.
