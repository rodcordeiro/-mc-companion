# Modelo de Marcador

Marcador é ponto de interesse do usuário ou importado do export. Vive no storage do app, não no arquivo do export. **Atualizar mapa** faz merge (ADR 0004). **Substituir fonte** apaga todos os Marcadores.

## Campos do MVP (product-brief)

| Campo | Obrigatório | Notas |
| --- | --- | --- |
| nome | sim | Entra no slug da chave de importação |
| dimensao | sim | Parte da chave |
| X | sim | Arredondado na chave |
| Z | sim | Arredondado na chave |
| Y | não | Não entra na chave de idempotência |
| descricao | não | Mutável na reimportação (ADR 0004) |
| tags | não | Texto livre; um campo; sem taxonomia e sem chips. Não entra na chave |

## Identidade

- **Id interno:** estável para edições manuais (ADR 0004). Sem ele, mudar nome/coordenada geraria nova chave.
- **Chave de idempotência (só importação):** `<dimension>:<round(x)>:<round(z)>:<slug(nome)>`  
  Exemplo: `overworld:155:-50:casa`

Dois marcadores na mesma coordenada podem coexistir se o nome (slug) for diferente.

## Origem (fechado o suficiente)

O app precisa distinguir importado vs criado no app para a reimportação atualizar o equivalente certo. Nome do campo de origem: **TBD** (não inventar enum).

## Fora deste modelo

- Rotas
- Ícone/cor como campos de alta manual do MVP (ADR 0004 cita ícone/cor na atualização de importação; formulário do brief não os pede — tratar ícone/cor como dados opcionais de importação, não como campos obrigatórios da alta)

## Critérios de aceite

- Dado tags preenchidas, quando o usuário salva, então o texto é persistido como está (sem parse em lista).
- Dado importação, quando a chave coincide, então atualiza o existente e não duplica.
- Dado edição manual, quando nome, dimensão ou X/Z mudam, então o id interno permanece; a chave de importação só vale na importação.
- Dado exclusão, quando o usuário confirma, então o Marcador some do storage local até **Atualizar mapa** recriar a mesma chave, se ela ainda existir no export.
- Dado **Atualizar mapa**, quando a chave coincide, então atualiza o existente e não duplica; manuais sem equivalente no export permanecem.
- Dado **Substituir fonte**, quando o usuário confirma, então todos os Marcadores somem do storage; o novo export pode recriar os seus.
