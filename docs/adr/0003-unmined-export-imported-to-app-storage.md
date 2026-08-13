# ADR 0003 - Export uNmINeD Importado para Storage do App

## Status

Aceita.

## Contexto

O usuario seleciona uma pasta contendo arquivos do export uNmINeD. Em mobile, acesso persistente a pasta original pode ser fragil ou revogado.

## Opcoes

- Referenciar a pasta original.
- Copiar/importar o export para storage interno do app.
- Exigir servidor externo.

## Decisao

No MVP, copiar/importar o export uNmINeD para armazenamento interno do app.

## Consequencias

- O mapa continua funcionando apos reiniciar o app.
- A pasta original nao precisa permanecer acessivel.
- O app pode ocupar bastante armazenamento; a copia interna antiga e removida depois da nova estar valida.
- Sera necessario mostrar status/progresso e tratar reimportacao/substituicao.
