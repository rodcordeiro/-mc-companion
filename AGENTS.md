# AGENTS.md — MC Companion

Companion Android (alvo Expo / React Native) para mapas Minecraft a partir de exports uNmINeD. **Fase atual: só documentação.** Sem scaffold, sem `package.json`, sem `src/`.

## Como usar este contexto

| Quando | Onde |
| --- | --- |
| Guideline mobile (layout Expo esperado) | `$nero` → `references/guidelines/mobile-guidelines.md` |
| Estrutura real do checkout | `.agents/references/structure.md` |
| Vocabulário e regras de produto | `CONTEXT.md` + `docs/specs/index.md` |
| ADRs | `docs/adr/` |
| Runtime / bootstrap (ainda inexistente) | `.agents/references/runtime.md` |
| Como mudar e validar | `.agents/references/conventions.md` |
| Débitos vs guideline | `.agents/references/tech-debt.md` |
| Knowledge operacional | MCP `nero-knowledge-base`, projeto `mc-companion`, domínio `mobile` |
| Índice das referências locais | `.agents/references/index.md` |

## Regras rápidas

- Não criar scaffold nem código de produto sem pedido explícito.
- Não inventar regra de negócio: fonte é `docs/specs/` + `CONTEXT.md`.
- Grill de produto do MVP encerrado (2026-08-13). Wireframe: `docs/design.pen` só com Pencil MCP.
- Quando houver app: não editar o export uNmINeD original; copiar para storage interno.
- Validação hoje: revisão das specs. Sem lint/test/build até existir `package.json`.

## Skills

- Sempre: `$nero`.
- Quando existir código Expo/RN: `$vercel-react-native-skills` e `$react-native-best-practices`.
- Domain Skills de lib/UI/auth internas: omitidas (sem evidência no checkout).
