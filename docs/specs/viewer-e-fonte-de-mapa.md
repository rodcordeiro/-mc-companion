# Viewer e Fonte de Mapa

Contrato de spec (não código). ADRs 0001–0004 permanecem a fonte das decisões duráveis; este arquivo não as duplica.

Alinhamento 2026-08-19: o envelope da bridge e o modo de tiles do MVP foram fechados a partir do que o app já envia/recebe. HTTP `127.0.0.1` sai do MVP.

## Fronteiras

Nenhuma superfície assume estado da outra sem payload explícito.

```text
[App nativo Expo/Android]
        |  payload estruturado + comandos (postMessage / injectJavaScript)
        v
[WebView: HTML/JS Leaflet local do projeto]
        |  tiles via file / HTML local  (MVP)
        |  HTTP 127.0.0.1               (pós-MVP)
        v
[Fonte de Mapa: cópia do export no storage do app]
        tiles/ + metadados de mapa

[Storage de marcadores do app]  --não atravessa o export--
        |  app monta overlay
        v
        payload de overlay -> WebView
```

| Parte | Papel |
| --- | --- |
| App nativo | Dono do estado (Fonte de Mapa, marcadores, permissões). Carrega a página **local** do viewer. Envia payload estruturado. Não edita o export original. No MVP não sobe static server. |
| Viewer Leaflet | Página web local na WebView. `GridLayer`/tileLayer uNmINeD. Desenha só o overlay recebido. Não persiste marcadores. Não usa globais JS, `localStorage` ou o HTML do export como estado da sessão. |
| Fonte de Mapa | Cópia interna: tiles raster + metadados. Não é o banco de marcadores. O app **parseia nativamente** `unmined.map.properties.js` (objeto JS frouxo) e detecta pastas de tiles por Dimensão; o viewer não interpreta o JS do export. |
| Storage de marcadores | Única fonte canônica dos pins. Importação idempotente acontece **antes** do viewer (Configuração / ADR 0004). O viewer não importa markers. |

`expo-leaflet` não é dependência arquitetural. O shell é o HTML/JS do projeto, não o HTML/OpenLayers gerado pelo uNmINeD.

## App → WebView

Canal: `WebView.postMessage` e `injectJavaScript` no handler `window.__MC_COMPANION_VIEWER__` (ADR 0002). Envelope JSON com `type`. Recarregar a WebView exige reenvio.

| `type` | Campos | Fechado |
| --- | --- | --- |
| `init` | `tileBaseUrl`, `dimension`, `metadata`, `overlay`, `centerX`, `centerZ`, `zoom?` | Sim. `tileBaseUrl` é o URI da cópia interna (`file://` / directory URI). |
| `setDimension` | `dimension`, `overlay` | Sim |
| `setOverlay` | `overlay` | Sim |
| `centerOn` | `x`, `z`, `dimension?`, `zoom?`, `overlay` | Sim. Usado por “Ver no mapa”. |

`metadata` mínimo: `minZoom`, `maxZoom`, `defaultZoom`, `imageFormat`, `centerX?`, `centerZ?`, `dimensions.<dimensao>.{ available, tilePath }`.

`overlay[]` mínimo: `id`, `nome`, `dimensao`, `x`, `z`. O viewer mostra só a Dimensão atual. Ícone/cor do pin no MVP são visuais fixos do viewer, não campos do overlay. **Pós-MVP:** polilinhas de Rota/Eixos no mesmo canal.

Regras:

- Payload ausente: o viewer **não** completa com estado anterior implícito.
- Atualização de marcadores no app implica reenvio do overlay. A WebView não observa o storage nativo.
- Origem dos tiles no MVP = URI da cópia interna. Sem declaração de modo HTTP.

## WebView → App

Produto fechado: toque em marcador mostra detalhes em UI **nativa** (não popup HTML como fonte de verdade). Toque em área vazia não cria Marcador. Câmera (Dimensão, centro, zoom) **não** persiste entre sessões.

| `type` | Campos | Fechado |
| --- | --- | --- |
| `ready` | — | Sim. App responde com `init`. |
| `markerPress` | `id` | Sim |
| `emptyTap` | — | Sim (o app ignora para alta) |
| `error` | `message?` | Sim |

Handshake: o viewer anuncia `ready`; o app envia `init`. Sem `init`, não há mapa.

## Tiles no MVP

1. Fonte válida no storage interno
2. WebView carrega HTML local do bundle (Leaflet vendorizado)
3. `tileBaseUrl` / `baseUrl` apontam à **cópia interna**
4. Viewer pede tiles só a essa origem — sem rede externa no MVP
5. **Não** aponta o viewer para a pasta original do usuário

Static server em `127.0.0.1` é **pós-MVP**. Se no futuro exigir nativo incompatível com o Expo do MVP, reavaliar ADR 0001 — não improvisar no viewer.

Paridade file vs HTTP no Android não está garantida a priori; o aceite do MVP é smoke no device com file/HTML.

Sem Fonte de Mapa: o viewer não inventa mapa. Empty/CTA é produto/navegação (ver [navegacao.md](./navegacao.md)).

## Ciclo de vida

| Dado | Dono | Sobrevive restart? |
| --- | --- | --- |
| Cópia do export | Storage interno | Sim (ADR 0003) |
| Marcadores | Storage do app | Sim (ADR 0004) |
| HTML/JS do viewer | Bundle | Sim |
| Estado JS da WebView | Efêmero | Não — reload exige novo payload; câmera não é gravada |

O viewer não é cache canônico de tiles nem de markers. MVP: uma Fonte de Mapa ativa. Atualizar mapa troca a cópia (apaga a antiga depois da nova válida) e faz merge de overlay; Substituir fonte troca a cópia do mesmo modo e apaga todos os Marcadores só se o passo de marcadores concluir.

## Overlay

Controlado pelo app. Rotas: **pós-MVP** (ver [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md)).

## Critérios de aceite

- Dado Fonte de Mapa no storage, quando a home abre o viewer, então a WebView recebe do app origem de tiles + metadados + overlay, e não depende de estado global implícito nem do HTML original como dono dos marcadores.
- Dado marcadores locais, quando o mapa renderiza, então os pins correspondem ao overlay enviado pelo app.
- Dado tap no pin, quando os detalhes são exibidos, então a UI de detalhe é nativa.
- Dado reload da WebView sem reenvio, então mapa/markers **não** “voltam” por estado residual.
- Dado cold start com Fonte importada, quando o Mapa abre, então a Dimensão é Overworld e o viewport não restaura pan/zoom da sessão anterior.
- Dado importação concluída, então o viewer lê só a cópia interna; o export original permanece intocado.
- Dado o MVP, quando os tiles renderizam, então a origem é file/HTML da cópia interna — não HTTP `127.0.0.1` e não a pasta original.
- `expo-leaflet` não aparece como dependência arquitetural.

## Fora desta spec

- Parser Bedrock; renderer próprio de chunks; edição do mundo; iOS; sync cloud; multiplayer
- Rotas e Eixos (pós-MVP; glossário em `CONTEXT.md`)
- Porta HTTP, biblioteca e ciclo de vida de static server (pós-MVP)
