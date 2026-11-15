<!--
  destaque — uma frase sozinha na tela. Pergunta que abre discussão, tese da
  aula, número que impressiona. Fundo escuro da USCS.

  ---
  layout: destaque
  kicker: A pergunta
  title: Inteligência é <span class="ds-em">uma</span> coisa ou <span class="ds-em">várias</span>?
  fonte: Spearman (1904) · Thurstone (1938)
  ---

  `title` e `fonte` aceitam HTML. Um slide, uma frase — se precisar de mais
  de duas linhas, o layout errado é este.
-->
<script setup lang="ts">
// `title` chega pelo objeto `frontmatter`, não como prop — ver o comentário em capa.vue.
import { asset } from '../lib/asset'

const props = defineProps<{
  kicker?: string
  fonte?: string
  frontmatter?: Record<string, any>
}>()

const title = props.frontmatter?.title
const fundo = `url("${asset('/uscs-fundo-escuro.jpg')}")`
</script>

<template>
  <div class="slidev-layout ds-escuro ds-destaque" :style="{ backgroundImage: fundo }">
    <p v-if="kicker" class="ds-kicker" v-html="kicker" />
    <h1 v-if="title" v-html="title" />
    <div class="corpo"><slot /></div>
    <p v-if="fonte" class="ds-small fonte" v-html="fonte" />
  </div>
</template>

<style scoped>
.ds-destaque {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--ds-space-6) 8rem;
  text-align: center;
}

.ds-destaque :deep(h1) {
  max-width: 22ch;
  margin: 0;
  font-size: var(--ds-text-3xl);
  font-weight: var(--ds-peso-forte);
  line-height: 1.12;
}

.corpo:not(:empty) {
  margin-top: var(--ds-space-5);
  max-width: 46ch;
  color: var(--ds-muted);
}

.fonte {
  margin: var(--ds-space-6) 0 0;
}
</style>
