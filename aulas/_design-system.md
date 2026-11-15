---
theme: none
title: Design system USCS — catálogo
info: Um slide por layout e por componente, com a situação de uso nas notas
colorSchema: light
layout: capa
kicker: Deck de bancada
titulo: Design system <span class="ds-em">USCS</span>
subtitle: Um slide para cada layout e cada componente. Abra com <code>npm run ref</code>.
meta: O nome começa com <code>_</code>, então o site não publica este deck.
---

<!--
Este é o catálogo do design system: a versão renderizada do que docs/design-system.md
descreve por escrito. Toda vez que você criar um layout ou componente novo em aulas/,
acrescente um slide aqui — é o que mantém o catálogo confiável.

A aula aula-01-teorias-da-inteligencia.md usa as mesmas peças num conteúdo de verdade.
-->

---
layout: roteiro
kicker: O que tem aqui
title: O catálogo
itens:
  - { tema: Tokens, desc: as cores e a fonte do modelo USCS }
  - { tema: Layouts, desc: "8 locais + os que o Slidev já traz" }
  - { tema: Componentes, desc: "9 peças para usar dentro do slide" }
  - { tema: Markdown puro, desc: como texto sem enfeite se parece }
---

---
layout: secao
numero: "01"
title: Tokens
note: As cores e a fonte que o modelo da USCS autoriza. Nenhum layout escreve uma cor na mão.
---

---
layout: default
---

# As cores da marca

<div class="amostras">
  <div><span class="chip" style="background: var(--uscs-azul)"></span><code>#152342</code><em>azul — texto, títulos, fundo escuro</em></div>
  <div><span class="chip" style="background: var(--uscs-laranja)"></span><code>#EF7D00</code><em>laranja — o accent</em></div>
  <div><span class="chip" style="background: var(--uscs-amarelo)"></span><code>#E9BC00</code><em>amarelo — fim do degradê</em></div>
  <div><span class="chip" style="background: var(--ds-grad)"></span><code>--ds-grad</code><em>laranja → amarelo dos títulos</em></div>
  <div><span class="chip" style="background: var(--uscs-branco); border-color: var(--ds-rule)"></span><code>#FFFFFF</code><em>branco — fundo do slide claro</em></div>
  <div><span class="chip" style="background: var(--ds-accent-texto)"></span><code>--ds-accent-texto</code><em>laranja para letra sobre branco</em></div>
</div>

<Fonte>Trocar a identidade visual = editar <code>aulas/styles/tokens.css</code> (e as imagens <code>aulas/public/uscs-*.jpg</code>).</Fonte>

<style>
.amostras {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ds-space-3) var(--ds-space-6);
  margin-top: var(--ds-space-5);
}
.amostras > div { display: flex; align-items: center; gap: var(--ds-space-3); }
.amostras .chip {
  width: 2.2rem; height: 2.2rem; flex: none;
  border: 1px solid transparent; border-radius: var(--ds-radius-sm);
}
.amostras em { color: var(--ds-muted); font-size: var(--ds-text-sm); font-style: normal; }
</style>

<!--
Este slide usa um <style> local — a exceção que confirma a regra. Ele desenha uma amostra
de cor, que só existe neste catálogo. Numa aula, CSS solto é sinal de que falta um layout
ou um componente.
-->

---
layout: default
---

# Poppins, a fonte autorizada

<div class="escala">
  <p style="font-size: var(--ds-text-3xl); font-weight: var(--ds-peso-fino)">Thin 100 — número grande</p>
  <p style="font-size: var(--ds-text-2xl); font-weight: var(--ds-peso-forte)">Bold 700 — títulos</p>
  <p style="font-size: var(--ds-text-lg)">Light 300 — o corpo do texto, como nos contatos do modelo</p>
  <p style="font-size: var(--ds-text-base)">base — o corpo do texto · <span class="ds-em">ds-em</span> · <strong>negrito</strong></p>
  <p style="font-size: var(--ds-text-sm)">sm — legenda, tabela, crédito</p>
  <p style="font-size: var(--ds-text-xs)">xs — rótulo</p>
</div>

<style>
.escala p { margin: var(--ds-space-1) 0; max-width: none; line-height: 1.25; }
</style>

<!--
O modelo da USCS autoriza Poppins Thin e Bold. O corpo usa Light (300) — o peso dos textos
de contato do próprio modelo — porque Thin em letra pequena some no projetor.
-->

---
layout: secao
numero: "02"
title: Layouts
note: Escolha pela forma do conteúdo, não pela decoração.
---

---
layout: roteiro
kicker: "layout: roteiro"
title: Este slide é o layout <code>roteiro</code>
itens:
  - { tema: Um tópico, desc: e a explicação dele }
  - { tema: Outro tópico, desc: "com <code>atual</code> marcando onde estamos" }
  - Um item simples também vale
atual: 2
---

<!-- Situação: índice da aula, ou qualquer lista curta de tópico + explicação. Repetir o mesmo roteiro entre seções, mudando `atual`, ajuda a turma a se localizar. -->

---
layout: destaque
kicker: "layout: destaque"
title: Uma frase <span class="ds-em">sozinha</span> na tela.
fonte: o campo <code>fonte</code> vai aqui embaixo
---

<!-- Situação: a pergunta que abre a discussão, a tese da aula, o número que impressiona. Fundo escuro da USCS. -->

---
layout: figura
imagem: /curva-normal-qi.svg
legenda: O campo <code>legenda</code> aceita HTML.
lado: esquerda
---

# O layout `figura`

Imagem de um lado, texto do outro. `lado: esquerda` (como aqui) troca os dois de lugar, e
`ajuste: cover` faz a imagem preencher em vez de caber inteira.

O caminho é absoluto e sem a pasta: `/curva-normal-qi.svg` procura em
`aulas/public/curva-normal-qi.svg`.

<!-- Situação: quando a imagem É o argumento e o texto comenta. -->

---
layout: fecho
title: O layout <code>fecho</code>
pontos:
  - O que fica da aula, em uma linha cada
  - "Os itens aceitam <strong>HTML</strong>"
proximo: O campo <code>proximo</code> anuncia a aula seguinte
---

O corpo do slide é o lugar das referências.

---
layout: redes
---

<!-- layout: redes — o slide institucional com as redes da Pós-graduação USCS. Sem campos. -->

---
layout: encerramento
subtitle: "layout: encerramento — <code>title</code> e <code>subtitle</code> são opcionais"
---

---
layout: secao
numero: "03"
title: Componentes
note: O que se usa dentro de um slide, misturado ao markdown.
---

---
layout: default
---

# `<Nota>` — os quatro tipos

<Grade :cols="2">
<Nota titulo="Info">

O tipo padrão, com **markdown funcionando** — repare nas linhas em branco.

</Nota>
<Nota tipo="ok" titulo="Funciona">

Para confirmar o caminho certo.

</Nota>
<Nota tipo="alerta" titulo="Cuidado">

Para a pegadinha que a turma sempre cai.

</Nota>
<Nota tipo="erro" titulo="Não faça">

Para o erro que precisa ser nomeado como erro.

</Nota>
</Grade>

<!-- Situação: o aparte. Se o conteúdo é o ponto principal do slide, ele não vai numa <Nota> — vai no corpo. -->

---
layout: default
---

# `<Grade>` + `<Cartao>` e `<Numero>`

<Grade :cols="3">
<Cartao rotulo="passo 1" titulo="Comparar">

Três coisas do **mesmo tipo**, lado a lado.

</Cartao>
<Cartao rotulo="passo 2" titulo="Escolher" destaque>

O `destaque` pinta um cartão — um por grade.

</Cartao>
<Numero valor="100" rotulo="média do QI" detalhe="desvio-padrão 15" />
</Grade>

<Fonte><code>:cols</code> precisa dos dois-pontos — sem eles o Vue passa a string <code>"3"</code>.</Fonte>

<!-- Situação: <Cartao> compara coisas do mesmo tipo; <Numero> é o dado que a turma precisa guardar. -->

---
layout: default
---

# `<Termo>` e `<Citacao>`

<Termo palavra="Funções executivas" origem="o termo que a turma copia">

Processos que controlam e coordenam o comportamento dirigido a metas.

</Termo>

<Citacao autor="Alguém que você cita" fonte="Livro, 1999">

A citação de dentro do slide. Para uma frase ocupando a tela inteira, use o layout `destaque`.

</Citacao>

---
layout: default
---

# `<Pessoa>` e `<LinhaDoTempo>`

<div class="ds-grid">
<div>

<Pessoa nome="David Wechsler" papel="1896–1981 · psicólogo">

Sem `foto`, entra um monograma com a inicial.

</Pessoa>

</div>
<div>

<LinhaDoTempo :itens="[
  { quando: '1939', o_que: 'Wechsler-Bellevue', desc: 'a primeira escala' },
  { quando: '1949', o_que: 'WISC' },
  { quando: '2014', o_que: 'WISC-V', desc: 'o campo é texto livre' },
]" />

</div>
</div>

---
layout: secao
numero: "04"
title: Markdown puro
note: Sem componente nenhum. É assim que o texto de todo dia se parece.
---

---
layout: default
---

# Um slide comum

Parágrafo com **negrito no laranja**, *itálico*, `código inline` e um
[link](https://sli.dev/).

- Item de lista, com o traço laranja
- Outro item
  - Sublista fica menor e discreta

| campo | o que faz |
|---|---|
| `title` | vira o nome da aula no índice do site |
| `info` | a ementa de uma linha |
