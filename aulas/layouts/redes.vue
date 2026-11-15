<!--
  redes — o slide institucional das redes da Pós-graduação USCS (Facebook,
  Instagram, YouTube), igual ao do modelo. Vem logo antes do `encerramento`.

  ---
  layout: redes
  ---

  Não tem campo: o slide inteiro é a imagem do modelo (aulas/public/uscs-redes.jpg).
  Qualquer conteúdo escrito no corpo do slide é ignorado.
-->
<script setup lang="ts">
import { asset } from '../lib/asset'

const fundo = `url("${asset('/uscs-redes.jpg')}")`
</script>

<template>
  <div
    class="slidev-layout ds-escuro ds-redes"
    :style="{ backgroundImage: fundo }"
    role="img"
    aria-label="Pós-graduação USCS — Facebook: posgraduacaouscs · Instagram: @posuscs · YouTube: posgraduacaouscs"
  />
</template>

<style scoped>
.ds-redes {
  padding: 0;
}
</style>
