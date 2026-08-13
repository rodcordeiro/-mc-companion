# Tela Configuração

Onde o usuário seleciona a pasta do export uNmINeD e dispara a importação para o storage interno. Status da Fonte de Mapa atual. **Atualizar mapa** ou **Substituir fonte**.

Fluxo completo: [importacao.md](./importacao.md).

## Entrada

- Tab Configuração
- CTA do empty state do Mapa

## Comportamento fechado

- Controle de seleção da pasta do export
- Ao tocar, abre seletor de pasta/arquivos do Android
- Copia o export para storage interno (não edita o original)
- Exibe status da Fonte de Mapa atual
- Com Fonte pronta: duas ações — **Atualizar mapa** (merge de marcadores) e **Substituir fonte** (apaga todos os Marcadores)
- **Uma** Fonte por vez; o app não detecta se a pasta é “o mesmo mundo”
- Se o tamanho da pasta for **conhecido**, confirmar com o valor antes de copiar. Se **desconhecido**, seguir com progresso. Sem limite inventado em GB; disco cheio é erro do SO

## Estados

| Estado | UI | Microcopy |
| --- | --- | --- |
| Sem fonte | CTA de seleção | “Nenhuma fonte de mapa.” / “Selecionar pasta do export uNmINeD” |
| Permissão negada | Explicação + tentar de novo | “Sem acesso à pasta, o app não consegue importar o mapa.” / “Tentar novamente” |
| Validando | Progresso | “Validando export…” |
| Copiando | Progresso (volume pode ser grande) | “Importando mapa para o app…” |
| Importando marcadores | Progresso | “Importando marcadores…” |
| Ready | Status da fonte + duas ações | “Fonte de mapa importada.” / “Atualizar mapa” / “Substituir fonte de mapa” |
| Confirmar substituir | Dialog (só Substituir) | “Substituir a fonte de mapa apaga todos os marcadores. Continuar?” |
| Confirmar tamanho | Dialog, só se o tamanho for conhecido | “Este export tem cerca de {tamanho}. Continuar a importação?” |
| Error (sem espaço) | Mensagem + retry | “Não há espaço suficiente no aparelho.” |
| Error (cópia falhou) | Mensagem + retry | “A importação falhou. O export original não foi alterado.” |
| Error (marcadores falharam) | Fonte pronta + aviso; Mapa usável; Atualizar/Substituir disponíveis | “Mapa importado. Não foi possível importar os marcadores.” |

## Status a exibir (mínimo fechado)

- Há Fonte de Mapa ou não
- Última importação em andamento / concluída / falhou (incluindo falha só de marcadores)

Nome da pasta original e tamanho da cópia **depois** da importação **não** entram no MVP. Tamanho só aparece no dialog **antes** de copiar, quando conhecido.

**Fechado:** se o tamanho do export for conhecido, dialog com o valor antes de copiar (primeira importação, Atualizar e Substituir). Se desconhecido, copiar com progresso. Sem teto em GB. Disco cheio = erro do SO.

**Fechado:** **Atualizar mapa** abre o seletor de pasta; não usa o dialog de wipe. Texto de apoio: “Use para um novo export do mesmo mundo. Não apaga marcadores.”

**Fechado:** tiles ok e marcadores falharam → Fonte nova permanece; lista não muda; erro na Configuração. Sem retry só de marcadores: o usuário corrige o export e usa Atualizar ou Substituir. **Substituir** só limpa a lista se o passo de marcadores concluir.

## Acessibilidade

- Botão de seleção e status como texto nativo, não só ícone
- Progresso anunciável (não só spinner mudo)
- Erro de permissão com ação clara

## Critérios de aceite

- Dado o Android, quando o usuário escolhe uma pasta de export uNmINeD, então o app inicia a importação para storage local.
- Dado importação concluída, quando o usuário abre o Mapa, então os tiles vêm da cópia interna.
- Dado uma fonte já importada, quando o usuário **Atualiza o mapa** com um export válido, então a cópia de tiles é trocada e os Marcadores manuais permanecem (merge ADR 0004).
- Dado uma fonte já importada, quando o usuário confirma **Substituir fonte** e o passo de marcadores conclui, então a Fonte passa a ser a nova cópia e a lista é substituída pelos markers do novo export (ou vazia).
- Dado Fonte nova válida e falha só nos marcadores, quando o processo termina, então o Mapa usa a nova Fonte, os Marcadores não mudam e a Configuração mostra “Mapa importado. Não foi possível importar os marcadores.” Não há botão de reimportar só markers.
- Dado o dialog de substituir, quando o usuário cancela, então Fonte e Marcadores permanecem.
- Dado tamanho de pasta conhecido, quando o usuário seleciona o export, então vê o tamanho e confirma antes da cópia.
- Dado tamanho desconhecido, quando o usuário seleciona o export, então a cópia segue com progresso (sem dialog de tamanho).
- Dado o dialog de tamanho, quando o usuário cancela, então não copia.
- Dado o SO recusar a cópia por falta de espaço, quando o processo aborta, então a mensagem indica espaço insuficiente; Fonte antiga e Marcadores permanecem.
- Dado Atualizar ou Substituir com cópia nova válida, quando a troca conclui, então a Home usa só a nova cópia; a antiga no disco é apagada (se a exclusão falhar, a nova continua ativa).
- Dado Fonte importada, quando o usuário vê a Configuração, então o status mínimo basta (há fonte / última importação); nome da pasta e tamanho da cópia não são exigidos.
