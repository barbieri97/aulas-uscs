<!--
  <Numero> — um número grande com rótulo. Média e desvio-padrão de uma escala,
  quantos subtestes, que percentil — o dado que a turma precisa guardar.

  <Numero valor="100" rotulo="média do QI" detalhe="DP = 15" />

  Fica bem em <Grade :cols="3">. `valor`, `rotulo` e `detalhe` aceitam HTML.
  O valor sai em Poppins, no degradê laranja→amarelo da marca.
-->
<script setup lang="ts">
defineProps<{
  valor?: string | number
  rotulo?: string
  detalhe?: string
}>()
</script>

<template>
  <div class="ds-numero">
    <span class="valor" v-html="valor" />
    <span v-if="rotulo" class="rotulo" v-html="rotulo" />
    <span v-if="detalhe" class="detalhe" v-html="detalhe" />
  </div>
</template>

<style scoped>
.ds-numero {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-1);
}

.valor {
  width: fit-content;
  background: var(--ds-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: var(--ds-text-3xl);
  font-weight: var(--ds-peso-normal);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.rotulo {
  color: var(--ds-ink);
  font-size: var(--ds-text-base);
  font-weight: var(--ds-peso-forte);
  line-height: var(--ds-leading-tight);
}

.detalhe {
  color: var(--ds-muted);
  font-size: var(--ds-text-sm);
}
</style>
