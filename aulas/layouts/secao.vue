<!--
  secao — divisor: avisa que a aula virou de assunto. Fundo escuro da USCS (o
  saguão desfocado, com a chama no alto e a marca embaixo, à direita).

  ---
  layout: secao
  numero: "02"
  kicker: Parte 2
  title: As escalas <span class="ds-em">Wechsler</span>
  note: Da Wechsler-Bellevue (1939) ao WISC-V.
  ---

  `title`, `kicker` e `note` aceitam HTML. Sem `numero`, o número grande some.
-->
<script setup lang="ts">
// `title` chega pelo objeto `frontmatter`, não como prop — ver o comentário em capa.vue.
import { asset } from '../lib/asset'

const props = defineProps<{
  numero?: string | number
  kicker?: string
  note?: string
  frontmatter?: Record<string, any>
}>()

const title = props.frontmatter?.title
const fundo = `url("${asset('/uscs-fundo-escuro.jpg')}")`
</script>

<template>
  <div class="slidev-layout ds-escuro ds-secao" :style="{ backgroundImage: fundo }">
    <span v-if="numero !== undefined" class="numero">{{ numero }}</span>
    <div class="texto">
      <p v-if="kicker" class="ds-kicker" v-html="kicker" />
      <h1 v-if="title" v-html="title" />
      <p v-if="note" class="ds-lead" v-html="note" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* A margem direita deixa livre a coluna da chama e da marca USCS. */
.ds-secao {
  display: flex;
  align-items: center;
  gap: var(--ds-space-6);
  height: 100%;
  padding: var(--ds-space-6) 9rem var(--ds-space-6) 4.5rem;
}

/* Número em Poppins Thin, no degradê da marca: grande, mas leve. */
.numero {
  background: var(--ds-grad);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 8.5rem;
  font-weight: var(--ds-peso-fino);
  line-height: 0.9;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}

.texto {
  flex: 1;
  min-width: 0;
}

.texto :deep(h1) {
  margin: 0 0 var(--ds-space-3);
  font-size: var(--ds-text-2xl);
}

.texto .ds-lead {
  margin: 0;
}
</style>
