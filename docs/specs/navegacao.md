# Navegação

## Destinos (fechado)

Três destinos na navegação principal:

1. **Mapa** — Home; primeira tela ao abrir o app
2. **Marcadores** — lista e alta manual
3. **Configuração** — seleção, status, Atualizar mapa e Substituir fonte

Chrome nativo do app (tabs ou equivalente). O Viewer Leaflet vive só dentro da tela Mapa.

## First-run sem Fonte de Mapa (fechado)

Home permanece **Mapa**. Empty nativo (não HTML vazio) + CTA para Configuração. Sem wizard e sem redirect automático para Configuração.

## Estados transversais

| Estado | Comportamento |
| --- | --- |
| Com Fonte de Mapa | Mapa renderiza tiles; demais destinos acessíveis |
| Sem Fonte de Mapa | Mapa vazio + CTA; Marcadores e Configuração acessíveis |
| Importando | Configuração mostra progresso; Mapa não assume tiles incompletos |
| Permissão negada | Configuração explica e oferece tentar de novo; Mapa permanece vazio |

## Acessibilidade

- Destinos com rótulo visível e `accessibilityLabel` em pt-BR
- Destino atual anunciado
- Área de toque mínima ~48 dp; labels visíveis (não icon-only)
- WebView não substitui o chrome de navegação; TalkBack não deve ir para a WebView só por trocar de tab

## Microcopy

- Mapa
- Marcadores
- Configuração
- Empty (Mapa): “Nenhuma fonte de mapa importada.”
- CTA: “Importar export uNmINeD”

## Critérios de aceite

- Dado que o app inicia no Android, quando o usuário abre o aplicativo, então a primeira tela visível é o Mapa.
- Dado que não há Fonte de Mapa, quando o usuário está na Home, então vê empty nativo e o CTA “Importar export uNmINeD”; não é redirecionado para Configuração.
- Dado um marcador na lista, quando o usuário escolhe “Ver no mapa”, então navega para o Mapa com Dimensão e centro desse ponto.

## TBD

- Overlay de Rotas no Mapa (pós-MVP; ver [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md))
