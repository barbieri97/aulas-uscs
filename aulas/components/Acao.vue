<!--
  <Acao> — o que o aplicador FAZ: aponta, mostra a página, aciona o cronômetro.

  <Acao>

  Coloque o Livro de Estímulos aberto diante da criança e aponte o modelo.

  </Acao>

  Alterna com <Fala> (o que o aplicador DIZ) numa coluna, na ordem do manual.
-->
<template>
  <div class="ds-acao">
    <p class="rotulo">Faça</p>
    <div class="corpo"><slot /></div>
  </div>
</template>

<style scoped>
.ds-acao {
  display: flex;
  gap: var(--ds-space-3);
  align-items: baseline;
  margin: var(--ds-space-2) 0;
  padding: 0 var(--ds-space-3);
  border-left: var(--ds-border-thick) solid var(--ds-ink);
  color: var(--ds-muted);
  font-size: var(--ds-text-xs);
  line-height: 1.45;
}

.rotulo {
  flex: none;
  width: 2.6rem;
  margin: 0;
  color: var(--ds-ink);
  font-size: var(--ds-text-xs);
  font-weight: var(--ds-peso-forte);
  letter-spacing: var(--ds-tracking-kicker);
  text-transform: uppercase;
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
