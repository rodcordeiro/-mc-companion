# Importação

A Fonte de Mapa é o export uNmINeD copiado para o storage interno. O app não edita a pasta original.

## Sequência fechada (product-brief)

1. Usuário seleciona a pasta do export uNmINeD na Configuração
2. App valida arquivos esperados, no mínimo: `unmined.map.properties.js`, `unmined.map.regions.js` e `tiles/`
3. App copia o export para storage interno
4. App importa marcadores existentes no export, quando houver
5. Mapa passa a servir tiles da **cópia interna** via file/HTML local. Static server HTTP em `127.0.0.1` é pós-MVP.

Há **duas** ações depois da primeira importação (não o app adivinhar se é o mesmo mundo):

- **Atualizar mapa:** após a cópia nova estar válida, aponta a Fonte para ela, apaga a cópia antiga no disco e **só então** faz merge de marcadores (ADR 0004). Se o passo de marcadores falhar, a lista permanece.
- **Substituir fonte:** após a cópia nova estar válida, aponta a Fonte para ela e apaga a cópia antiga no disco. **Só apaga a lista de Marcadores se o passo de marcadores concluir** (sucesso ou export sem markers). Parse quebrado: não wipe.

## Regras fechadas

- Copy-on-import; original somente leitura do ponto de vista do app
- **Uma** Fonte de Mapa por vez
- **Atualizar mapa** troca a cópia de tiles e faz merge de marcadores; manuais permanecem; equivalentes atualizam; importado apagado volta se a chave ainda estiver no export
- **Substituir fonte** troca a cópia e, **quando o passo de marcadores concluir**, apaga **todos** os Marcadores locais e importa os do novo export (lista vazia se o export não tiver markers)
- Falha na cópia/validação da Fonte: Fonte antiga e Marcadores permanecem; rollback de tiles
- Falha **só** no passo de marcadores: Fonte nova permanece (mapa usável); Marcadores não mudam; erro visível na Configuração. Sem rollback da cópia. Sem botão de retry só de marcadores: o usuário corrige o export e usa **Atualizar mapa** ou **Substituir fonte** (recopia tiles)
- Após a cópia nova estar **válida**, apagar a cópia antiga no disco. Se a exclusão falhar, a Fonte nova permanece ativa (lixo no disco não desfaz a troca)
- Tamanho conhecido: confirmar antes de copiar. Tamanho desconhecido: copiar com progresso. Sem limite inventado em GB; disco cheio é erro do SO
- Após reinício, a Home usa a cópia interna
- Campos mutáveis do marcador importado podem atualizar no merge: descrição, ícone, cor, origem e `updatedAt` (ADR 0004)
- Formato de markers do uNmINeD pode variar; o importador deve ser tolerante (risco do brief, não schema fechado)

## Marcadores na importação

- Origem: arquivos de marcadores do export, se existirem
- Destino: storage de marcadores do app
- Chave: `<dimension>:<round(x)>:<round(z)>:<slug(nome)>`
- Equivalente encontrado: atualiza; não cria duplicata
- Equivalente **apagado pelo usuário**: a reimportação **recria** (o export manda de novo). Sem tombstone
- Marcador só local (alta manual) apagado **não** volta na reimportação
- Sem arquivo de markers no **primeiro** import: lista inalterada nesse passo (ainda vazia)
- Sem arquivo de markers após **Atualizar mapa**: lista local permanece (só não entram novos do export)
- Sem arquivo de markers após **Substituir fonte** (passo concluído): lista fica vazia
- Parse de markers **falhou**: lista inalterada (Atualizar e Substituir). Qualquer arquivo da raiz com parse ou I/O falho falha o passo inteiro — um irmão `ok` (inclusive `isEnabled: false`) não mascara a falha
- Arquivos de markers: só na **raiz** da Fonte. Export aninhado (ex. `nether/` com `index.html` próprio) é outra Fonte, não pasta de tiles
- I/O no passo de marcadores (ler arquivo) é falha desse passo: Fonte nova permanece; sem rollback da cópia

## Critérios de aceite

- Dado um export válido selecionado, quando a importação conclui, então existe Fonte de Mapa no storage interno e a pasta original não foi modificada.
- Dado a Home após importação, quando o usuário abre o mapa, então ela não depende da pasta original.
- Dado markers no export, quando a importação roda, então equivalentes entram no storage local.
- Dado a mesma chave já existente, quando o usuário **Atualiza o mapa**, então não há duplicata.
- Dado um Marcador importado que o usuário apagou, quando **Atualiza o mapa** com um export que ainda tem a chave, então o ponto **volta** (novo id interno, mesma chave).
- Dado um Marcador só local apagado, quando **Atualiza o mapa**, então ele **não** volta.
- Dado Marcadores manuais, quando o usuário **Atualiza o mapa**, então esses pontos permanecem.
- Dado o app reiniciado, quando o usuário abre o app, então Fonte de Mapa e marcadores locais permanecem (se a Fonte não tiver sido substituída).
- Dado uma Fonte já importada, quando o usuário confirma **Substituir fonte** e o passo de marcadores **conclui**, então todos os Marcadores locais são apagados e, em seguida, os do novo export entram (se existirem).
- Dado tiles/Fonte válidos e falha no passo de marcadores (parse ou I/O), quando a cópia já está ativa, então o Mapa usa a Fonte nova, a lista de Marcadores não muda e a Configuração mostra o erro. Sem rollback da Fonte.
- Dado um arquivo de markers ilegível ou com parse falho na raiz e outro arquivo da raiz que parseia (inclusive `isEnabled: false`), quando a importação termina, então o passo de marcadores falha e a lista permanece.
- Dado **Substituir fonte** com parse de markers falho, quando o processo termina, então a lista **não** é apagada.
- Dado falha ao copiar/validar a nova Fonte, quando o processo aborta, então Marcadores e Fonte antiga permanecem.
- Dado tamanho conhecido, quando o usuário confirma, então a cópia inicia; se cancelar, não copia.
- Dado tamanho desconhecido, quando o usuário seleciona a pasta, então a cópia inicia com progresso.
- Dado falta de espaço no aparelho, quando a cópia falha, então Fonte antiga e Marcadores permanecem.
- Dado Atualizar ou Substituir com cópia nova válida, quando a exclusão da cópia antiga conclui, então só a Fonte nova permanece no disco.
- Dado a exclusão da cópia antiga falhar, quando a Fonte nova já está válida, então o app usa a nova; não reverte para a antiga.
- Dado erro só de marcadores, quando o usuário tenta de novo, então não há ação só de markers: usa Atualizar mapa ou Substituir fonte (recopia).

## TBD

Nenhum TBD de produto. Export real observado (2026-08-19): [Inspect real uNmINeD export markers and tiles](https://github.com/rodcordeiro/-mc-companion/issues/4). CLI gera **uma pasta por Dimensão**; markers em `custom.markers.js` (`UnminedCustomMarkers`, pins sem `y`/`dimension` → Overworld); tiles em `tiles/zoom.{z}/{xd}/{yd}/tile.{x}.{y}.{imageFormat}`.
