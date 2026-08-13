# ADR 0004 - Idempotencia de Marcadores

## Status

Aceita.

## Contexto

Marcadores devem ser independentes do export uNmINeD, mas marcadores existentes no export devem ser importados. Reimportacoes nao podem duplicar pontos equivalentes.

## Opcoes

- Usar apenas nome como chave.
- Usar apenas coordenadas como chave.
- Usar dimensao, coordenadas e nome normalizado.
- Gerar ids aleatorios a cada importacao.

## Decisao

Usar chave de idempotencia no formato:

```txt
<dimension>:<round(x)>:<round(z)>:<slug(nome)>
```

Exemplo:

```txt
overworld:155:-50:casa
```

## Consequencias

- Reimportar o mesmo marker atualiza em vez de duplicar.
- Markers diferentes na mesma coordenada ainda podem coexistir se tiverem nomes diferentes.
- Editar nome ou coordenada pode gerar nova chave; o app deve manter `id` interno para edicoes manuais.
- Campos mutaveis podem ser atualizados na importacao: descricao, icone, cor, origem e `updatedAt`.
