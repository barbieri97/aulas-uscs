<!--
  <Fonte> — o crédito no pé do slide, ancorado embaixo à esquerda, em letra branca
  sobre a faixa azul da USCS (à esquerda da marca).

  <Fonte>Gottfredson (1997). <em>Intelligence, 24</em>(1), 13–23.</Fonte>

  Fica em `position: absolute`, então não empurra o conteúdo: pode aparecer em
  qualquer posição do markdown do slide.
-->
<template>
  <p class="ds-fonte">
    <slot />
  </p>
</template>

<style scoped>
.ds-fonte {
  position: absolute;
  left: 3rem;
  right: 24%;
  bottom: 0.9rem;
  margin: 0;
  max-width: none;
  color: rgba(255, 255, 255, 0.86);
  font-size: var(--ds-text-xs);
  line-height: var(--ds-leading-normal);
}

/* Sobre a faixa escura, o chip de código inline precisa ser claro. */
.ds-fonte :deep(code) {
  background: rgba(255, 255, 255, 0.14);
  color: inherit;
}
</style>
