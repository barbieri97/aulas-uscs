<!--
  encerramento — o "Obrigado(a)!" do modelo USCS: fundo com a fachada desfocada,
  a chama no alto e a linha de contatos da Pós (site, e-mail, telefone) embaixo.

  ---
  layout: encerramento
  ---

  Sem campo nenhum, o slide sai igual ao do modelo. Para trocar a frase:

  ---
  layout: encerramento
  title: Até a próxima aula!
  subtitle: Prof.ª Fulana · fulana@uscs.edu.br
  ---

  `title` e `subtitle` aceitam HTML. Os contatos institucionais fazem parte da
  imagem de fundo (aulas/public/uscs-encerramento.jpg) e não mudam.
-->
<script setup lang="ts">
// `title` chega pelo objeto `frontmatter`, não como prop — ver o comentário em capa.vue.
import { asset } from '../lib/asset'

const props = defineProps<{
  subtitle?: string
  frontmatter?: Record<string, any>
}>()

const title = props.frontmatter?.title ?? 'Obrigado(a)!'
const fundo = `url("${asset('/uscs-encerramento.jpg')}")`
</script>

<template>
  <div class="slidev-layout ds-escuro ds-encerramento" :style="{ backgroundImage: fundo }">
    <div class="texto">
      <h1><span class="ds-grad" v-html="title" /></h1>
      <p v-if="subtitle" class="subtitulo" v-html="subtitle" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ds-encerramento {
  padding: 0;
}

/* Centro do "Obrigado(a)!" no modelo: 50% × 50%. A faixa de contatos começa em ≈78%. */
.texto {
  position: absolute;
  top: 50%;
  left: 12%;
  right: 12%;
  transform: translateY(-50%);
  text-align: center;
}

.texto :deep(h1) {
  margin: 0;
  font-size: var(--ds-text-3xl);
  font-weight: var(--ds-peso-forte);
  line-height: 1.15;
  /* O texto em degradê não aceita text-shadow; o drop-shadow faz a sombra suave do modelo. */
  filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.45));
}

.subtitulo {
  margin: var(--ds-space-3) auto 0;
  max-width: none;
  color: var(--ds-ink);
  font-size: var(--ds-text-base);
  font-weight: var(--ds-peso-leve);
}
</style>
