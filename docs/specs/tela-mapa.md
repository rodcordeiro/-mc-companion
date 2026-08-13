# Tela Mapa

Home do app. Exibe a Fonte de Mapa (tiles uNmINeD) no Viewer Leaflet e overlay de marcadores locais.

Rotas/Eixos no mapa: **pós-MVP**. Ver [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md).

## Entrada

- Abertura do app
- Tab Mapa

## Comportamento fechado

- Renderiza tiles da Fonte de Mapa importada (não da pasta original)
- Overlay de marcadores controlado pelo app (não pelo HTML do export)
- Toque em marcador abre detalhes (nome e posição no mínimo)
- Toque em área vazia: pan/zoom apenas. **Não** cria Marcador
- Alta de Marcador só na tela Marcadores
- Seletor de **Dimensão** no chrome nativo (fora da WebView): Overworld / Nether / End. Padrão no **cold start**: Overworld. Dimensão sem tiles no export fica desabilitada, não escondida.
- Overlay e tiles seguem a Dimensão selecionada
- Comando **centrar** no X/Z vindo de “Ver no mapa” (Marcadores)
- **Não persiste** Dimensão, centro nem zoom entre sessões. Centro inicial: metadado do export se existir; senão o default do GridLayer. Trocar de aba não é garantia de produto.

## Estados

| Estado | UI | Microcopy |
| --- | --- | --- |
| Empty (sem Fonte de Mapa) | Mensagem + CTA para Configuração | “Nenhuma fonte de mapa importada.” / “Importar export uNmINeD” |
| Loading (tiles/metadados) | Indicador sobre o viewer | “Carregando mapa…” |
| Error (fonte ilegível / viewer falhou) | Mensagem + atalho para Configuração | “Não foi possível abrir o mapa.” / “Ver configuração” |
| Ready | Tiles + overlay | — |
| Overlay vazio | Mapa visível, sem pins | Sem alerta bloqueante |

## Acessibilidade

- Chrome nativo (tabs, empty/error, seletor de Dimensão) permanece acessível fora da WebView
- Detalhe do marcador em sheet nativo após o tap, não popup HTML opaco
- WebView é canvas; lista em Marcadores é o equivalente acessível dos pins (TalkBack na WebView é frágil)
- Wrapper nativo: “Mapa do mundo. Use a aba Marcadores para a lista.”

## Hipótese visual

**Hipótese:** map-first, dark-friendly, companion Minecraft no Android. Não é sistema de marca.

## Critérios de aceite

- Dado uma Fonte de Mapa importada, quando o usuário abre a Home, então o mapa aparece sem depender da pasta original do export.
- Dado marcadores locais, quando o mapa está ready, então os marcadores aparecem como overlay.
- Dado um marcador visível, quando o usuário toca nele, então vê detalhes.
- Dado o app reiniciado com Fonte de Mapa já importada, quando o usuário abre a Home, então o mapa continua disponível, a Dimensão é Overworld e o centro não retoma o pan/zoom da sessão anterior (salvo “Ver no mapa” nesta abertura).
- Dado que não há Fonte de Mapa, quando o usuário abre a Home, então vê empty nativo + CTA para Configuração, sem redirect automático.
- Dado uma Fonte de Mapa com Overworld, quando o usuário abre o Mapa, então a Dimensão inicial é Overworld.
- Dado Nether ou End sem tiles no export, quando o usuário vê o seletor, então essa opção está desabilitada (visível, não oculta).
- Dado o mapa ready, quando o usuário toca área vazia, então não abre alta de Marcador.
- Dado “Ver no mapa” a partir da lista, quando o Mapa abre, então a Dimensão e o centro correspondem ao Marcador.

## Pós-MVP

Overlay da Rota no Viewer (Eixos ortogonais + Hub como vértice). Payload estruturado do app, mesmo canal dos marcadores. Sem desenhar a partir de `custom.railways.js` do export.

## TBD

Nenhum ponto de produto aberto nesta tela além do pós-MVP de Rotas.
