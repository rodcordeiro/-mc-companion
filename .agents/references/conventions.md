# Convenções

- Rotas finas em `src/app/`; UI em `src/screens/<Feature>/`; comportamento em `hooks/`.
- Skills: `$vercel-react-native-skills`, `$react-native-best-practices`, `$expo-router`.
- Preferir `pnpm` (`pnpm-lock.yaml`).
- Não inventar regra: produto fechado vive em `docs/specs/` + `CONTEXT.md`. Envelope da bridge, boolean `imported` e tiles file/HTML no MVP já estão fechados. Confirmar schema uNmINeD real continua validação, não regra nova.
- Wireframe só via Pencil MCP em `docs/design.pen`.
- Validar: `pnpm typecheck`. Smoke no Android: importar export pequeno, Overworld via file/HTML, Atualizar sem duplicar, Substituir com wipe condicional, restart.
