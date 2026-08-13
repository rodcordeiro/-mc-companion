# Convenções

## Agora (só docs)

- Mudanças pequenas e localizadas em `docs/`, `CONTEXT.md`, `AGENTS.md`, `.agents/references/`.
- Não scaffold. Não código de produto.
- Não desenhar `docs/design.pen` sem Pencil MCP.
- Não inventar regra: TBD permanece TBD.
- Validar: consistência entre `CONTEXT.md`, specs e ADRs.

## Quando existir app Expo

- Rotas finas; comportamento em hooks de feature (guideline `$nero` mobile).
- Skills: `$vercel-react-native-skills`, `$react-native-best-practices`.
- Preferir `pnpm` se houver `pnpm-lock.yaml`.
- Comandos reais virão do `package.json` — não assumir scripts do guideline.
- Testes: importação uNmINeD pequena, Overworld, Atualizar sem duplicar, Substituir com wipe condicional, restart. Lista em `docs/specs/index.md`.
