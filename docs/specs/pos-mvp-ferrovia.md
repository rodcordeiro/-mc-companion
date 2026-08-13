# Pós-MVP — Ferrovia (Rota, Eixo, Estação)

Fora do MVP. Glossário: [`CONTEXT.md`](../../CONTEXT.md). Recorte: [`docs/product-brief.md`](../product-brief.md).

## Intenção confirmada

Depois do MVP, a tela Marcadores ganha alta de **Rota** (origem + destino). O app deriva Hub (se couber no teto) e **Eixos**. Overlay da Rota no Mapa. Um botão randomiza o nome da Rota a partir de um **pool misturado** (RPG + metrô) em **português**. Não cria Hub novo. Sequência de N Estações fica para depois.

## Geração de Eixos (fechado nesta sessão)

1. Trechos só em Eixo (X constante ou Z constante). Sem diagonal.
2. Cada perna (origem→Hub e Hub→destino) usa canto ortogonal: X da origem **daquela perna** primeiro, depois Z do destino da perna. Sem Hub automático.
3. Escolha de Hub (mesma dimensão): no máximo **um**. O de menor custo Manhattan origem→hub→destino. Desviar só se esse custo for **≤ 2×** a Manhattan direta origem→destino. Se nenhum Hub passar no teto, gerar só os Eixos diretos (sem desvio).
4. Hub escolhido é vértice da Rota. Cantos ortogonais das pernas não são Estações.
5. Alta da Rota: o usuário escolhe **origem e destino** (Marcadores existentes, mesma dimensão). Hub e cantos são derivados.
6. Overlay no Mapa: o Viewer Leaflet desenha os Eixos da Rota (polilinha ortogonal), no espírito de `custom.railways.js`, via payload do app — não lendo o export original.
7. Nome da **Rota**: o usuário informa **ou** aciona **um** randomizar sobre um pool misturado (RPG + metrô) em **português**. Sem seletor de estilo. Randomizar de novo substitui o nome da Rota. Eixos não têm nome próprio. Listas concretas: implementação, não este documento.

Custo Manhattan = `|ΔX| + |ΔZ|`.

Exemplo no Eixo (confirmado):

| Ponto | X | Z |
| --- | --- | --- |
| Casa | 100 | 100 |
| Hub 1 | 100 | 200 |
| Bruxa 1 | 100 | 230 |

Rota: Casa → Hub 1 → Bruxa 1.

Exemplo fora do Eixo (confirmado):

| Ponto | X | Z |
| --- | --- | --- |
| Casa | 100 | 100 |
| Hub 1 | 110 | 200 |
| Bruxa 1 | 100 | 230 |

Rota (pernas ortogonais): `(100,100)` → `(100,200)` → `(110,200)` Hub → `(110,230)` → `(100,230)`.

Direto = 130; via Hub A `(110,200)` ≈ 150 (entra, 150 ≤ 260). Hub B `(800,800)` fica de fora.

## O que o mine_mcp faz hoje

O MCP `user-mine_mcp` **não** tem entidade Rota nem gerador de Eixo.

- Persistência: pontos nomeados (X/Z, tipo, tags, dimensão) e receitas/guias.
- Ferrovia no store de pontos: tags (`ferrovia`, `estacao`, `rota-atual`, `rota-pausada`) em Marcadores do mundo — são estações/destinos, não a linha.
- `distance_to_point` / `nearest_point_by_type`: distância euclidiana X/Z, não Manhattan e não trilho.
- Backlog v0.4 do `mine_mcp` cita “rota” como feature futura do MCP (busca/overlay), **não** o overlay worldly railroad. Não acoplar os dois termos.

Pontos vivos consultados em 2026-08-13 (recorte ferroviário):

| Nome | X | Z | Papel observado |
| --- | --- | --- | --- |
| Casa | 155 | -50 | origem |
| Estacao Hub 1 | 129 | -198 | hub / midpoint Casa–Bruxa 2 |
| Bruxa 2 | 103 | -346 | destino atual |
| Bruxa 1 | -281 | 138 | ramal futuro (pausado) |

## Onde a Rota existe hoje

Canônico operacional do overlay: `projetos/personal/minecraft/output/custom.railways.js` (`UnminedCustomRailways.routes`).

Cada rota tem nome, estilo e `points: [x, z][]`. Não há campo “eixo”; o eixo aparece quando dois pontos consecutivos compartilham X ou Z.

Dois padrões coexistindo no arquivo atual:

1. **Linha Casa-Bruxa 2** — Casa → Hub 1 → Bruxa 2. Os três pontos são colineares (hub = midpoint). Não é eixo ortogonal; é polilinha reta no plano XZ.
2. **Ramal futuro Bruxa 1** — Hub 1 → `[129, 138]` (X do hub, Z da cabana) → Bruxa 1. Comentário no arquivo: “eixo provisorio”. Este é o padrão de **eixos ortogonais** da decisão Nero `projects/minecraft/decisions/2026-08-12-primeira-estacao-hub-1-no-midpoint-casa-vila-1`.

**Fechado nesta sessão:** alta origem+destino; overlay no Mapa; nome na Rota (digitado ou um randomizar de pool misturado RPG+metrô em PT); Eixos sem nome próprio; gerar Eixos (padrão 2); no máximo um Hub se via ≤ 2× o direto. Sequência de N Estações fica para depois. Listas concretas de nomes: implementação.

## Fronteira

- MVP do Companion: Marcadores pontuais + overlay no mapa. Sem desenhar Rota **no MVP**.
- Slice ferrovia: overlay de Rota/Eixos no mesmo Viewer, payload do app.
- mine_mcp: fonte possível de importar pontos como Marcadores no futuro; não é o motor da ferrovia.
- `custom.railways.js`: precedente de overlay no export uNmINeD; o app não deve editar o export original (ADR 0003). Rotas do Companion ficam no storage do app.

## TBD

Nenhum ponto de produto aberto neste slice. Listas concretas do pool: implementação.
