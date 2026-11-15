<!--
  capa — o primeiro slide de uma aula. Reproduz a capa do modelo USCS: a foto
  da fachada à direita, o painel azul desfocado à esquerda com a chama laranja,
  a pílula "Pós-graduação" e o título centralizado embaixo dela.

  ---
  layout: capa
  kicker: Pós-graduação          # a pílula (padrão: "Pós-graduação")
  subtitle: A pergunta que a aula responde.
  meta: Aula 03 · Avaliação psicológica e neuropsicologia
  titulo: Teorias da <span class="ds-em">inteligência</span>   # opcional
  ---

  `title` vem do headmatter (no primeiro slide o bloco é headmatter e frontmatter
  ao mesmo tempo) — não repita o campo. Ele é texto puro, porque vira o nome da
  aba do navegador e o título na página inicial do site.

  `titulo` (opcional) é a versão da capa com HTML: palavras dentro de
  <span class="ds-em">…</span> saem no degradê laranja→amarelo, como o
  "Expandindo" e o "construindo" do modelo. Sem ele, a capa mostra o `title`.
  `titulo`, `kicker`, `subtitle` e `meta` aceitam HTML.

  A chama laranja e a fachada fazem parte da imagem de fundo
  (aulas/public/uscs-capa.jpg) — o texto é posicionado embaixo da chama.
-->
<script setup lang="ts">
// `title` é campo reservado do Slidev: ele o usa para o índice e NÃO o repassa como prop.
// O jeito de lê-lo é pelo objeto `frontmatter`, que chega inteiro em todo layout.
// Ver docs/design-system.md → "Os campos que o Slidev não entrega".
import { asset } from '../lib/asset'

const props = withDefaults(defineProps<{
  kicker?: string
  subtitle?: string
  meta?: string
  titulo?: string
  frontmatter?: Record<string, any>
}>(), {
  kicker: 'Pós-graduação',
})

const title = props.titulo ?? props.frontmatter?.title
// Caminho de imagem montado em script passa por `asset()` — ver aulas/lib/asset.ts.
const fundo = `url("${asset('/uscs-capa.jpg')}")`
</script>

<template>
  <div class="slidev-layout ds-escuro ds-capa" :style="{ backgroundImage: fundo }">
    <div class="painel">
      <p v-if="kicker" class="ds-kicker" v-html="kicker" />
      <h1 v-if="title" v-html="title" />
      <p v-if="subtitle" class="subtitulo" v-html="subtitle" />
      <div class="corpo"><slot /></div>
      <p v-if="meta" class="meta" v-html="meta" />
    </div>
  </div>
</template>

<style scoped>
.ds-capa {
  padding: 0;
}

/* O painel ocupa a metade azul da foto. O centro horizontal (≈28% da largura) e o
   topo (logo abaixo da chama, ≈35% da altura) foram medidos no modelo original. */
.painel {
  position: absolute;
  top: 35%;
  left: 4%;
  width: 48.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.painel .ds-kicker {
  margin-bottom: var(--ds-space-5);
  padding: 0.3em 1.5em 0.34em;
  font-size: var(--ds-text-base);
  letter-spacing: 0.01em;
}

.ds-capa :deep(h1) {
  margin: 0;
  color: var(--ds-ink);
  font-size: var(--ds-text-2xl);
  font-weight: var(--ds-peso-forte);
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-wrap: balance;
}

.subtitulo {
  margin: var(--ds-space-4) 0 0;
  max-width: 34ch;
  color: var(--ds-muted);
  font-size: var(--ds-text-base);
  font-weight: var(--ds-peso-leve);
  line-height: var(--ds-leading-normal);
}

.corpo:not(:empty) {
  margin-top: var(--ds-space-4);
}

.meta {
  margin: var(--ds-space-6) 0 0;
  max-width: none;
  color: var(--ds-ink);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-peso-leve);
  letter-spacing: 0.02em;
}
</style>
