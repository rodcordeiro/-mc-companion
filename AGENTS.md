# AGENTS.md — MC Companion

Companion Android (Expo / React Native) para mapas Minecraft a partir de exports uNmINeD.

## Como usar este contexto

| Quando | Onde |
| --- | --- |
| Guideline mobile | `$nero` → `references/guidelines/mobile-guidelines.md` |
| Estrutura do checkout | `.agents/references/structure.md` |
| Vocabulário e regras de produto | `CONTEXT.md` + `docs/specs/index.md` |
| ADRs | `docs/adr/` |
| Runtime / bootstrap | `.agents/references/runtime.md` |
| Como mudar e validar | `.agents/references/conventions.md` |
| Débitos vs guideline | `.agents/references/tech-debt.md` |
| Knowledge operacional | MCP `nero-knowledge-base`, projeto `mc-companion`, domínio `mobile` |
| Índice das referências locais | `.agents/references/index.md` |

## Regras rápidas

- Não inventar regra de negócio: fonte é `docs/specs/` + `CONTEXT.md`.
- Grill de produto do MVP encerrado (2026-08-13). Wireframe: `docs/design.pen` só com Pencil MCP.
- Não editar o export uNmINeD original; copiar para storage interno.
- `expo-leaflet` não é dependência arquitetural. Viewer = HTML/JS local em WebView.
- Ferrovia (Rota/Eixo/Hub) fora do MVP.

## Skills

- Sempre: `$nero`.
- Código Expo/RN: `$vercel-react-native-skills`, `$react-native-best-practices`, `$expo-router`, `$expo-project-structure`, `$expo-dev-client`.
- Docs de lib: `$context7-mcp`.
