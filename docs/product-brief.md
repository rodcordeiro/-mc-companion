# MC Companion - Product Brief

## Objetivo

Criar um app mobile Android para servir como companion de Minecraft, exibindo um mapa navegavel a partir de exports uNmINeD e permitindo gerenciar marcadores independentes do export.

## Usuario-Alvo

Jogador que ja gera mapa do mundo Minecraft com uNmINeD e quer consultar o mapa no celular durante a partida, com pontos de interesse proprios e importados.

## Problema

O export uNmINeD gera uma visualizacao web util, mas nao e um app companion mobile focado em uso durante o jogo. Marcadores precisam ficar sob controle do app. Rotas e Eixos da ferrovia sao evolucao pos-MVP na tela de Marcadores.

## MVP

### Home / Mapa

- Primeira tela do app.
- Exibe mapa uNmINeD importado.
- Renderiza tiles por Leaflet dentro de WebView propria.
- Mostra marcadores salvos localmente.
- Permite tocar em marcador para ver detalhes.
- Cold start: Overworld; nao persiste camera entre sessoes.

### Marcadores

- Lista marcadores locais (todas as Dimensoes, sem filtro; ordem Overworld → Nether → End, depois nome).
- Permite adicionar, editar e apagar marcador manualmente (só nesta tela; o Mapa não cria pins).
- Campos iniciais: nome, dimensao, X, Z, Y opcional, descricao, tags (texto livre).
- Importa marcadores existentes no export uNmINeD quando disponiveis.
- Reimportar nao deve duplicar marcadores equivalentes.

### Configuracao

- Campo de selecao da pasta do export uNmINeD.
- Ao clicar, abre seletor de pasta/arquivos no Android.
- Importa/copia o export para storage interno do app.
- Se o tamanho da pasta for conhecido, confirma antes de copiar; se desconhecido, segue com progresso. Sem limite inventado em GB.
- Exibe status minimo da fonte de mapa atual (ha fonte / ultima importacao). Sem nome de pasta nem tamanho da copia no status.
- Permite Atualizar mapa (merge de marcadores) ou Substituir fonte (apaga todos os marcadores). Uma Fonte por vez.

## Fora do MVP

- iOS.
- Rotas e Eixos da ferrovia (slice na tela Marcadores; ver `docs/specs/pos-mvp-ferrovia.md`).
- Multi-world (várias Fontes de Mapa simultâneas).
- Edicao direta do mundo Minecraft.
- Parsing completo de mundo Bedrock.
- Renderizador proprio de chunks/tiles.
- Sincronizacao cloud.
- Multiplayer em tempo real.

## Modelo de Importacao

1. Usuario seleciona pasta do export uNmINeD.
2. App valida arquivos esperados, como `unmined.map.properties.js`, `unmined.map.regions.js` e `tiles/`.
3. App copia o export para storage interno.
4. App importa marcadores existentes, quando houver.
5. Mapa passa a servir tiles da cópia interna via file/HTML local (sem rede externa). Static server HTTP em `127.0.0.1` fica para depois do MVP.

## Riscos

- Volume de tiles pode ocupar muito armazenamento.
- Acesso persistente a pastas no Android pode variar por versao/API.
- WebView com muitos tiles pode exigir ajustes de cache.
- Static server local (pós-MVP) pode exigir biblioteca compativel com Expo/Android.
- Formato de markers do uNmINeD pode variar; importador deve ser tolerante.

## Criterios de Aceite do MVP

- Usuario seleciona um export uNmINeD no Android.
- App importa o export para storage local.
- Home abre o mapa sem depender da pasta original.
- Marcadores aparecem como overlay sobre o mapa.
- Atualizar mapa nao duplica marcadores equivalentes e nao apaga manuais.
- Substituir fonte apaga todos os marcadores so se o passo de marcadores concluir.
- Tiles ok e marcadores falharam: mapa usavel; lista inalterada; erro na Configuracao. Sem retry so de marcadores.
- Aviso de tamanho quando conhecido; copia falha se o aparelho nao tiver espaco.
- Atualizar/Substituir apaga a copia interna antiga depois da nova estar valida.
- App continua funcional apos reiniciar.
- Cold start do Mapa: Overworld; camera nao persiste.
