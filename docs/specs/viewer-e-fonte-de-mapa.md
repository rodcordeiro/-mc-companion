# Viewer e Fonte de Mapa

Contrato de spec (não código). ADRs 0001–0004 permanecem a fonte das decisões duráveis; este arquivo não as duplica.

## Fronteiras

Nenhuma superfície assume estado da outra sem payload explícito.

```text
[App nativo Expo/Android]
        |  payload estruturado + comandos
        v
[WebView: HTML/JS Leaflet local do projeto]
        |  tiles via HTTP 127.0.0.1  (preferido)
        |  ou file / HTML local      (fallback)
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
| App nativo | Dono do estado (Fonte de Mapa, marcadores, permissões). Sobe/derruba o static server. Carrega a página **local** do viewer. Envia payload estruturado. Não edita o export original. |
| Viewer Leaflet | Página web local na WebView. `GridLayer` uNmINeD. Desenha só o overlay recebido. Não persiste marcadores. Não usa globais JS, `localStorage` ou o HTML do export como estado da sessão. |
| Fonte de Mapa | Cópia interna: tiles raster + metadados. Não é o banco de marcadores. Como o viewer consome `unmined.map.properties.js` / `unmined.map.regions.js` (parse nativo vs bruto): **TBD**. |
| Storage de marcadores | Única fonte canônica dos pins. Importação idempotente acontece **antes** do viewer (Configuração / ADR 0004). O viewer não importa markers. |

`expo-leaflet` não é dependência arquitetural. O shell é o HTML/JS do projeto, não o HTML/OpenLayers gerado pelo uNmINeD.

## App → WebView

Canal: bridge da WebView (ADR 0002). Mecanismo (`postMessage`, injeção) e envelope JSON: **TBD**. Não inventar schema.

| Categoria | Fechado | TBD |
| --- | --- | --- |
| Origem dos tiles | HTTP `127.0.0.1` na cópia interna, **ou** file/HTML local | Porta, path, lifetime, headers |
| Metadados de mapa | O necessário ao `GridLayer` e à navegação do export | Propriedades exatas, bounds, zoom, dimensão inicial |
| Overlay | Lista do storage do app, suficiente para posicionar e identificar. Mínimo: id, nome, dimensão, X, Z. Viewer mostra só a Dimensão atual. **Pós-MVP:** polilinhas de Rota/Eixos no mesmo canal | Ícone/cor, diff vs snapshot, schema da polilinha |
| Comandos | O app envia a Dimensão selecionada e pode pedir centrar em X/Z (“Ver no mapa”) | Catálogo extra (limpar overlay, etc.) |

Regras:

- Recarregar a WebView exige reenvio. Payload ausente: o viewer **não** completa com estado anterior implícito.
- Atualização de marcadores no app implica reenvio do overlay. A WebView não observa o storage nativo.
- Origem dos tiles coerente com o modo ativo (server **ou** fallback). Como o modo é declarado: **TBD**.

## WebView → App

Produto fechado: toque em marcador mostra detalhes em UI **nativa** (não popup HTML como fonte de verdade).

Protocolo (shape da mensagem, handshake “viewer pronto”, pan/zoom, erro de tile): **TBD**.

Produto fechado: **não persistir** câmera/viewport (Dimensão, centro, zoom) entre sessões. Toque em área vazia não cria Marcador.

## Tiles e fallback

Preferido:

1. Fonte válida no storage interno
2. Static server local em `127.0.0.1`
3. App envia a origem HTTP no payload
4. Viewer pede tiles só a essa origem — sem rede externa no MVP

Biblioteca, porta e ciclo de vida do server: **TBD**. Se exigir nativo incompatível com o Expo do MVP, reavaliar ADR 0001 — não improvisar no viewer.

Fallback (server indisponível):

1. App detecta a falha (critério **TBD**)
2. **Não** aponta o viewer para a pasta original do usuário
3. Serve a **cópia interna** via file/HTML local; o payload reflete esse modo
4. Overlay e metadados continuam vindo do app

Disparo automático do fallback **não** tem GWT fechado. Paridade file vs HTTP no Android não está garantida (CORS / leitura de tiles: validar no dispositivo).

Sem Fonte de Mapa: o viewer não inventa mapa. Empty/CTA é produto/navegação (hipótese em [navegacao.md](./navegacao.md)).

## Ciclo de vida

| Dado | Dono | Sobrevive restart? |
| --- | --- | --- |
| Cópia do export | Storage interno | Sim (ADR 0003) |
| Marcadores | Storage do app | Sim (ADR 0004) |
| HTML/JS do viewer | Bundle | Sim |
| Estado JS da WebView | Efêmero | Não — reload exige novo payload; câmera não é gravada |
| Processo do static server | App nativo | Não — reerguer ou fallback |

O viewer não é cache canônico de tiles nem de markers. MVP: uma Fonte de Mapa ativa. Atualizar mapa troca a cópia (apaga a antiga depois da nova válida) e faz merge de overlay; Substituir fonte troca a cópia do mesmo modo e apaga todos os Marcadores.

## Overlay

Controlado pelo app. Rotas: **pós-MVP** (ver [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md)).

## Critérios de aceite

- Dado Fonte de Mapa no storage, quando a home abre o viewer, então a WebView recebe do app origem de tiles + metadados + overlay, e não depende de estado global implícito nem do HTML original como dono dos marcadores.
- Dado marcadores locais, quando o mapa renderiza, então os pins correspondem ao overlay enviado pelo app.
- Dado tap no pin, quando os detalhes são exibidos, então a UI de detalhe é nativa.
- Dado reload da WebView sem reenvio, então mapa/markers **não** “voltam” por estado residual.
- Dado cold start com Fonte importada, quando o Mapa abre, então a Dimensão é Overworld e o viewport não restaura pan/zoom da sessão anterior.
- Dado importação concluída, então o viewer lê só a cópia interna; o export original permanece intocado.
- Preferência: static server local; fallback file/HTML — sem GWT de failover automático.
- `expo-leaflet` não aparece como dependência arquitetural.

## Fora desta spec

- Parser Bedrock; renderer próprio de chunks; edição do mundo; iOS; sync cloud; multiplayer
- Rotas (até decisão de glossário)
- Schema JSON, porta HTTP, biblioteca do static server
