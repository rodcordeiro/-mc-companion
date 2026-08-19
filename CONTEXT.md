# Contexto do Dominio: MC Companion

## Termos

### MC Companion
Aplicativo mobile Android para consultar e navegar visualmente por mapas Minecraft a partir de exports gerados pelo uNmINeD.

### Export uNmINeD
Pasta gerada pelo uNmINeD contendo tiles raster, metadados e arquivos auxiliares de visualizacao do mapa. No MC Companion, o export e fonte de mapa, nao fonte canonica de marcadores do usuario.

### Fonte de Mapa
Export uNmINeD importado para o armazenamento interno do app e usado para alimentar a visualizacao Leaflet. No MVP ha uma Fonte de Mapa por vez. Ao Atualizar ou Substituir, a copia antiga no disco e apagada depois da nova estar valida.
_Avoid_: multi-world; varias copias simultaneas; apagar a antiga antes da nova estar pronta

### Mapa
Tela inicial do app. Exibe os tiles do mundo Minecraft, marcadores e overlays do MVP, numa Dimensao por vez. No MVP a camera (Dimensao, centro, zoom) nao persiste entre sessoes.
_Avoid_: Home como tela distinta; incluir Rota no MVP; restaurar pan/zoom no restart

### Dimensao
Overworld, Nether ou End. O Mapa mostra uma Dimensao de cada vez.
_Avoid_: world, layer, id interno como rotulo de UI

### Marcador
Ponto de interesse definido pelo usuario ou importado de arquivos de marcadores existentes no export uNmINeD. Marcadores pertencem ao storage do app. Atualizar mapa faz merge; Substituir fonte apaga todos os Marcadores. Tags e texto livre. A lista do MVP mostra todas as Dimensoes, sem filtro, ordenada por Dimensao (Overworld, Nether, End) e depois nome; o overlay do Mapa segue a Dimensao selecionada.
_Avoid_: waypoint, POI, point do mine_mcp como entidade do app

### Tags
Campo opcional de texto livre no Marcador. Sem taxonomia e sem chips no MVP.
_Avoid_: lista de chips; vocabulario fechado

### Rota
Linha ferroviaria nomeada entre uma Estacao origem e uma Estacao destino. O nome e da Rota, nao de cada Eixo.
_Avoid_: sequencia de N estacoes neste slice; trilha; pathfinding; rota de navegacao do mine_mcp; nomear cada trecho X/Z

### Eixo
Trecho de uma Rota alinhado a um unico eixo do mundo: X constante ou Z constante.
_Avoid_: segmento diagonal, linha reta entre dois pontos quaisquer

### Estacao
Marcador que e vertice de uma Rota.
_Avoid_: stop; tratar Hub como tipo de Marcador separado

### Hub
Estacao de juncao da ferrovia. Uma Rota desvia para um Hub ja existente, mesmo fora do Eixo direto entre origem e destino.
_Avoid_: midpoint criado automaticamente; estacao comum sem papel de juncao

### Importacao de Marcadores
Processo que le marcadores existentes no export uNmINeD e cria ou atualiza marcadores locais sem duplicar entradas equivalentes. Se a Fonte ja estiver valida e este passo falhar, o mapa permanece e a lista nao muda. Nao ha retry so deste passo: o usuario usa Atualizar mapa ou Substituir fonte.

### Chave de Idempotencia do Marcador
Identificador estavel usado para evitar duplicidade na importacao. Formato recomendado: `<dimension>:<round(x)>:<round(z)>:<slug(nome)>`.

### Atualizar mapa
Acao na Configuracao que troca a copia de tiles da Fonte atual e importa marcadores com merge (ADR 0004), sem apagar a lista.
_Avoid_: detectar automaticamente se e o mesmo mundo

### Substituir fonte
Acao na Configuracao que troca a Fonte de Mapa. Apaga todos os Marcadores so quando o passo de marcadores concluir (sucesso ou export sem markers).
_Avoid_: usar Substituir para refresh do mesmo mundo; wipe se o parse falhar

### Configuracao
Tela onde o usuario seleciona a pasta do export uNmINeD e dispara a primeira importacao, Atualizar mapa ou Substituir fonte. Status minimo: ha Fonte / ultima importacao. Sem nome de pasta nem tamanho da copia no status do MVP.

### Viewer Leaflet
Pagina web local, renderizada em WebView, responsavel por exibir tiles uNmINeD e overlays no mapa.

### Static Server Local
Servidor HTTP local embutido no app para servir tiles por `127.0.0.1`. Fora do MVP; no recorte atual o Viewer lê a cópia da Fonte de Mapa via file/HTML.
_Avoid_: exigir HTTP para o aceite do MVP
