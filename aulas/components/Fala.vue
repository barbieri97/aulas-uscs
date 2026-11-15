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
    <p class="rotulo">Diga<span v-if="quando" class="quando"> · {{ quando }}</span></p>
    <div class="corpo"><slot /></div>
  </div>
</template>

<style scoped>
.ds-fala {
  margin: var(--ds-space-2) 0;
  padding: var(--ds-space-2) var(--ds-space-4);
  border-left: var(--ds-border-thick) solid var(--ds-accent);
  border-radius: 0 var(--ds-radius-sm) var(--ds-radius-sm) 0;
  background: var(--ds-accent-wash);
}

.rotulo {
  margin: 0 0 var(--ds-space-1);
  color: var(--ds-accent-texto);
  font-size: var(--ds-text-xs);
  font-weight: var(--ds-peso-forte);
  letter-spacing: var(--ds-tracking-kicker);
  text-transform: uppercase;
}

.quando {
  color: var(--ds-muted);
  font-weight: var(--ds-peso-normal);
  text-transform: none;
  letter-spacing: 0;
}

.corpo {
  font-weight: var(--ds-peso-normal);
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
