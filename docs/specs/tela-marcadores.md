# Tela Marcadores

Lista marcadores locais e permite alta manual. Marcadores pertencem ao storage do app, não ao export.

Campos e chave: [modelo-marcador.md](./modelo-marcador.md).  
Importação a partir do export: [importacao.md](./importacao.md).

## Entrada

- Tab Marcadores

## Comportamento fechado

- Lista **única**, todas as Dimensões. Sem filtro e sem seletor de ordem. Cada item mostra nome, Dimensão e X/Z
- Ordem: Dimensão (Overworld → Nether → End), depois nome A–Z; empate: X, depois Z
- Overlay do Mapa continua só na Dimensão selecionada (ver [tela-mapa.md](./tela-mapa.md))
- Alta **somente nesta tela** (formulário nativo). O Mapa não cria pins
- Editar e apagar na mesma tela. Edição usa o **id interno** (ADR 0004); não gera outro Marcador
- Apagar pede confirmação. Overlay do Mapa atualiza após salvar ou apagar
- Marcadores importados do export aparecem na mesma lista
- **Atualizar mapa** não duplica equivalentes (ADR 0004) e **recria** Marcador importado que tinha sido apagado, se a chave ainda estiver no export
- **Substituir fonte** apaga a lista inteira **só se o passo de marcadores concluir**; o novo export pode popular de novo. Parse falho: lista intacta
- **Ver no mapa:** vai para a Home, seleciona a Dimensão do Marcador e centra o viewer nesse X/Z

## Estados

| Estado | UI | Microcopy |
| --- | --- | --- |
| Empty | CTA para adicionar; menção a importar via Configuração | “Nenhum marcador ainda.” / “Adicionar marcador” |
| Loading | Indicador na lista | “Carregando marcadores…” |
| Error (falha de leitura local) | Retry | “Não foi possível carregar os marcadores.” |
| Ready | Lista | — |
| Formulário inválido | Erro por campo | “Informe o nome.” / “Informe X e Z.” / “Informe a dimensão.” |

## Microcopy do formulário

- Nome
- Dimensão
- X / Z / Y (opcional)
- Descrição
- Tags: um campo de texto livre, opcional
- Salvar
- Cancelar
- Excluir (com confirmação: “Excluir este marcador?”)
- Ver no mapa

## Acessibilidade

- Lista com nome, Dimensão e coordenadas anunciáveis
- Formulário com labels nativos, não placeholder-only
- Erros associados ao campo

## Critérios de aceite

- Dado o storage local, quando o usuário abre Marcadores, então vê a lista local (incluindo importados), **sem filtro** de Dimensão; cada item mostra a Dimensão.
- Dado Marcadores em mais de uma Dimensão, quando o usuário está na lista, então todos aparecem nessa ordem (Overworld, Nether, End; depois nome); o overlay do Mapa segue só a Dimensão selecionada lá.
- Dado o formulário preenchido com nome, dimensão, X e Z, quando o usuário salva, então o marcador entra na lista e no overlay do mapa.
- Dado Y, descrição ou tags vazios, quando o usuário salva, então o marcador ainda é aceito.
- Dado tags com texto livre, quando o usuário salva, então o texto é guardado como está (sem chips nem parse em lista).
- Dado o mapa visível, quando o usuário toca área vazia, então a alta **não** ocorre; só o formulário em Marcadores cria.
- Dado um marcador na lista, quando o usuário edita e salva, então o mesmo id interno permanece e o overlay reflete a mudança.
- Dado um marcador na lista, quando o usuário confirma excluir, então some da lista e do overlay.
- Dado um importado apagado, quando o usuário **Atualiza o mapa** com um export que ainda tem a chave, então o ponto volta.
- Dado Marcadores manuais, quando o usuário **Atualiza o mapa**, então esses pontos permanecem.
- Dado Marcadores locais, quando o usuário confirma **Substituir fonte** e o passo de marcadores conclui, então a lista e o overlay passam a refletir só o novo export (vazios se não houver markers).
- Dado parse de markers falho após Fonte nova válida, quando o processo termina, então a lista permanece.
- Dado um marcador na lista, quando o usuário escolhe “Ver no mapa”, então o app abre o Mapa, seleciona a Dimensão desse Marcador e centra no X/Z.

## Pós-MVP

Alta de **Rota** nesta tela: origem + destino (Marcadores existentes). Hub e Eixos são derivados. Overlay no Mapa. Nome da **Rota** informado ou **um** randomizar (pool misturado RPG + metrô, em português). Sequência de N Estações fica para depois. [pos-mvp-ferrovia.md](./pos-mvp-ferrovia.md).
