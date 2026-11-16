<!--
  <Protocolo> — um quadro do Protocolo de Registro do WISC-IV (ou de outro teste),
  recriado com a mesma estrutura do impresso: a letra do quadro num quadradinho,
  o título e a tabela.

  <Protocolo letra="A" titulo="Cálculo da Idade da Criança">
  <table>
  <tr><th></th><th>Ano</th><th>Mês</th><th>Dia</th></tr>
  <tr><th>Data de Aplicação</th><td>2003</td><td><s>6</s> 5</td><td><s>12</s> 42</td></tr>
  </table>
  </Protocolo>

  Convenção da tabela de dentro (HTML puro, sem linha em branco no meio):
  - `<th>` é o que vem **impresso** no protocolo (rótulos, cabeçalhos) — azul;
  - `<td>` é o que o psicólogo **escreve à mão** — laranja, em negrito;
  - `<td class="bloq">` é a célula sombreada do impresso (a coluna que não recebe
    aquele subteste, ou a que recebe e vem pintada); pode ter valor ou não;
  - `<tr class="soma">` é a linha de totais, com fio duplo em cima;
  - `<s>` risca um valor (o "empréstimo" do cálculo da idade);
  - `<span class="imp">` marca o que é impresso dentro de uma célula manuscrita
    (os parênteses dos suplementares, o "÷10", a sigla "ICV" antes do composto).

  `compacto` aperta as linhas para os quadros de 12+ linhas (o de conversão
  dos pontos brutos). `titulo` aceita HTML.
-->
<script setup lang="ts">
defineProps<{
  letra?: string
  titulo?: string
  compacto?: boolean
}>()
</script>

<template>
  <div class="ds-protocolo" :class="{ compacto }">
    <div v-if="letra || titulo" class="cab">
      <span v-if="letra" class="letra">{{ letra }}</span>
      <span v-if="titulo" class="titulo" v-html="titulo" />
    </div>
    <div class="corpo"><slot /></div>
  </div>
</template>

<style scoped>
.ds-protocolo {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-1);
  margin: var(--ds-space-2) 0;
}

.cab {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.letra {
  display: inline-grid;
  place-items: center;
  width: 1.35em;
  height: 1.35em;
  border: var(--ds-border) solid var(--ds-ink);
  color: var(--ds-ink);
  font-size: var(--ds-text-xs);
  font-weight: var(--ds-peso-forte);
}

.titulo {
  color: var(--ds-ink);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-peso-forte);
}

.corpo :deep(table) {
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  font-size: var(--ds-text-xs);
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}

.ds-protocolo .corpo :deep(th),
.ds-protocolo .corpo :deep(td) {
  /* `.ds-protocolo` na frente: vence o `tr:last-child td { border-bottom: 0 }` do base.css */
  padding: 0.22rem var(--ds-space-2);
  border: var(--ds-border) solid var(--ds-ink);
  vertical-align: middle;
}

/* O impresso: rótulos em azul, sem a caixa-alta das tabelas do deck. */
.corpo :deep(th) {
  color: var(--ds-ink);
  font-size: var(--ds-text-xs);
  font-weight: var(--ds-peso-leve);
  letter-spacing: 0;
  text-align: left;
  text-transform: none;
}

.corpo :deep(thead th),
.corpo :deep(th.col) {
  background: var(--ds-ink-wash);
  font-weight: var(--ds-peso-forte);
  text-align: center;
}

/* O manuscrito: o que o psicólogo preenche. */
.corpo :deep(td) {
  color: var(--ds-accent-texto);
  font-weight: var(--ds-peso-forte);
  text-align: center;
}

.corpo :deep(td.bloq) {
  background: color-mix(in srgb, var(--uscs-azul) 16%, transparent);
}

.corpo :deep(tr.soma > *) {
  border-top: var(--ds-border-thick) double var(--ds-ink);
}

.corpo :deep(.imp) {
  color: var(--ds-ink);
  font-weight: var(--ds-peso-leve);
}

.corpo :deep(s) {
  color: var(--ds-muted);
  font-weight: var(--ds-peso-leve);
}

.ds-protocolo.compacto .corpo :deep(th),
.ds-protocolo.compacto .corpo :deep(td) {
  padding: 0.08rem var(--ds-space-2);
}
</style>
