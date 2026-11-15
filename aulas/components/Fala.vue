<!--
  <Fala> — o que o aplicador DIZ, palavra por palavra, como está no manual.

  <Fala quando="se a criança errar">

  Veja, foi assim que eu fiz.

  </Fala>

  Alterna com <Acao> (o que o aplicador FAZ) numa coluna, na ordem do manual.
  `quando` é opcional: a situação em que a fala entra (item de exemplo, erro…).
-->
<script setup lang="ts">
defineProps<{
  quando?: string
}>()
</script>

<template>
  <div class="ds-fala">
    <p class="rotulo">Diga</p>
    <div class="corpo">
      <p v-if="quando" class="quando">{{ quando }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Rótulo e texto na mesma linha, como em <Acao>: os dois alinham pela coluna do
   rótulo e um slide de falas cabe acima da faixa. */
.ds-fala {
  display: flex;
  gap: var(--ds-space-3);
  align-items: baseline;
  margin: var(--ds-space-2) 0;
  padding: var(--ds-space-2) var(--ds-space-3);
  border-left: var(--ds-border-thick) solid var(--ds-accent);
  border-radius: 0 var(--ds-radius-sm) var(--ds-radius-sm) 0;
  background: var(--ds-accent-wash);
  font-size: var(--ds-text-sm);
  line-height: 1.45;
}

.rotulo {
  flex: none;
  width: 2.6rem;
  margin: 0;
  color: var(--ds-accent-texto);
  font-size: var(--ds-text-xs);
  font-weight: var(--ds-peso-forte);
  letter-spacing: var(--ds-tracking-kicker);
  text-transform: uppercase;
}

.corpo {
  font-weight: var(--ds-peso-normal);
}

.corpo .quando {
  margin: 0 0 0.1rem;
  color: var(--ds-muted);
  font-size: var(--ds-text-xs);
  font-weight: var(--ds-peso-leve);
}

.corpo :deep(p) {
  margin: var(--ds-space-1) 0;
  max-width: none;
}

.corpo :deep(> :first-child) {
  margin-top: 0;
}

.corpo :deep(> :last-child) {
  margin-bottom: 0;
}
</style>
