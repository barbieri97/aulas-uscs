# O design system das aulas (identidade USCS)

Um design system **local**, escrito em `aulas/`, sem tema npm nenhum (`theme: none` no
headmatter). Ele reproduz o modelo de apresentações da **Pós-graduação USCS** (o PPTX "Modelos
PPT USCS — Fundo Branco"): as imagens de fundo foram extraídas do modelo, e as cores e a fonte
são as do slide "Orientação de cores e letras para apresentações". Trocar por um tema pronto,
ou gerar outro DS do zero, é assunto de [`temas.md`](temas.md).

Este arquivo é o contrato: o que existe, quando usar cada coisa e as armadilhas do Slidev que
já custaram um slide.

---

## Onde mora cada coisa

O Slidev define a raiz do projeto como **a pasta do arquivo `.md`**. As aulas estão em
`aulas/`, então é lá dentro que ele procura tudo:

```
aulas/
├── styles/index.css     ← o único CSS que o Slidev importa (os outros entram por @import)
│   ├── tokens.css       ← cor, tipo, espaço, forma — a identidade visual inteira
│   ├── base.css         ← como o markdown puro se parece
│   └── utilities.css    ← as classes `ds-*` que um slide pode usar
├── layouts/*.vue        ← a forma do slide (campo `layout:` do frontmatter)
├── components/*.vue     ← peças usadas dentro do slide (auto-importadas, sem `import`)
├── setup/mermaid.ts     ← diagramas mermaid nas cores da USCS
├── lib/asset.ts         ← resolve caminho de imagem contra a base do site
└── public/              ← imagens; `/foto.png` no markdown = `aulas/public/foto.png`
    └── uscs-*.jpg       ← os fundos institucionais, extraídos do modelo PPTX
```

### Os fundos institucionais

| arquivo | onde aparece | o que tem |
|---|---|---|
| `uscs-fundo-conteudo.jpg` | todo slide claro (via `base.css`) | branco, faixa azul diagonal, marca "USCS Pós-Graduação" |
| `uscs-capa.jpg` | `capa` | painel azul com a chama à esquerda, fachada à direita |
| `uscs-fundo-escuro.jpg` | `secao`, `destaque` | saguão desfocado, chama no alto, marca embaixo |
| `uscs-redes.jpg` | `redes` | o slide das redes sociais da Pós, exatamente como no modelo |
| `uscs-encerramento.jpg` | `encerramento` | fachada desfocada com a linha de contatos (site, e-mail, telefone) |

Os textos que vinham "chumbados" nas imagens da capa e do "Obrigado(a)!" foram apagados da
imagem: o layout os escreve em Poppins, e você pode trocar.

Uma `public/` ou uma `components/` na **raiz do repositório** não seria vista por ninguém.

---

## Tokens

Toda decisão visual está em `aulas/styles/tokens.css`. Layouts e componentes só consomem
`var(--ds-*)`; nenhum escreve um hex na mão. **Mudar a identidade visual das aulas é editar
esse arquivo, e só ele** — inclusive a página inicial do site, que lê os mesmos tokens.

| grupo | tokens |
|---|---|
| marca | `--uscs-azul` `#152342` · `--uscs-laranja` `#EF7D00` · `--uscs-amarelo` `#E9BC00` · `--uscs-branco` · `--uscs-preto` · `--uscs-azul-medio` · `--ds-grad` (laranja→amarelo) |
| cor | `--ds-bg` `--ds-surface` `--ds-ink` `--ds-muted` `--ds-rule` `--ds-accent` `--ds-accent-texto` `--ds-accent-2` `--ds-ok` `--ds-warn` `--ds-danger` |
| cor translúcida | `--ds-accent-wash` `--ds-accent-2-wash` `--ds-ink-wash` |
| tipo | `--ds-font-sans` (Poppins), `--ds-peso-fino` `--ds-peso-leve` `--ds-peso-normal` `--ds-peso-forte`, escala `--ds-text-xs` … `--ds-text-3xl`, `--ds-leading-*`, `--ds-tracking-kicker` |
| espaço | `--ds-space-1` … `--ds-space-8`, `--ds-pad-slide` (o de baixo é maior: reserva a faixa azul) |
| forma | `--ds-radius-sm` `--ds-radius` `--ds-radius-lg` `--ds-radius-pill` `--ds-border` `--ds-border-thick` `--ds-shadow` |

**Dois contextos de cor.** O slide claro vive em `:root` (texto azul sobre branco). O escuro é
a classe `.ds-escuro`, que os layouts escuros (`capa`, `secao`, `destaque`, `redes`,
`encerramento`) põem na própria raiz: ela redefine os tokens de cor, e tudo o que estiver
dentro — componentes inclusive — fica branco sobre azul. `.dark` (modo escuro do Slidev) só
serve à página inicial; as aulas fixam `colorSchema: light`.

**Laranja em letra pequena.** O `#EF7D00` puro tem contraste baixo sobre branco em texto fino.
Marcadores, bordas, fundos e números grandes usam `--ds-accent`; texto corrido em laranja
(negrito, `ds-em`, rótulos) usa `--ds-accent-texto`, um laranja mais escuro. O amarelo nunca
vai em texto sobre branco — só no degradê e no escuro.

A escala de tipo é fechada: sete tamanhos. Quando um slide parece precisar de um tamanho fora
dela, quase sempre o problema é conteúdo demais no slide.

### Fonte

**Poppins**, a única autorizada pelo modelo. Vem do pacote npm `@fontsource/poppins`, importado
no topo de `aulas/styles/index.css` (pesos 100, 300, 300 itálico, 400 e 700): os arquivos de
fonte entram no build, então o deck publicado e o PDF não dependem do Google Fonts. **Não**
use o campo `fonts:` do headmatter.

| peso | token | uso |
|---|---|---|
| Thin 100 | `--ds-peso-fino` / `.ds-fino` | número grande da `secao`, tipo de efeito |
| Light 300 | `--ds-peso-leve` | corpo do texto (é o peso dos contatos no modelo) |
| Regular 400 | `--ds-peso-normal` | pílula do kicker, valor do `<Numero>` |
| Bold 700 | `--ds-peso-forte` | títulos, negrito, destaques |

---

## Layouts

Vão no campo `layout:` do frontmatter do slide. Os campos de cada um viram props.

| layout | quando usar | campos |
|---|---|---|
| layout | fundo | quando usar | campos |
|---|---|---|---|
| `capa` | fachada | o primeiro slide da aula | `kicker` (padrão "Pós-graduação") `title` `titulo` `subtitle` `meta` |
| `secao` | escuro | avisar que a aula virou de assunto | `numero` `kicker` `title` `note` |
| `destaque` | escuro | uma frase sozinha na tela: a pergunta que abre a discussão, a tese | `kicker` `title` `fonte` |
| `roteiro` | claro | o índice da aula, ou lista de tópico + explicação | `kicker` `title` `itens[]` `atual` |
| `figura` | claro | quando a imagem **é** o argumento e o texto comenta | `imagem` `legenda` `lado` `ajuste` |
| `fecho` | claro | o que fica, o que vem, referências | `kicker` `title` `pontos[]` `proximo` |
| `redes` | institucional | as redes da Pós-graduação USCS — penúltimo slide | (nenhum) |
| `encerramento` | institucional | o "Obrigado(a)!" com os contatos — último slide | `title` `subtitle` (opcionais) |

Na `capa`, `title` vem do headmatter e é texto puro (vira o nome da aba e o título na página
inicial); `titulo` é a versão com HTML só para a capa — use-o para pôr palavras no degradê
laranja→amarelo, como o "Expandindo horizontes" do modelo.

Os layouts do próprio Slidev continuam valendo, **e herdam o fundo claro com a faixa**:
`default`, `center`, `two-cols`, `two-cols-header`, `iframe`, `full`, `none`. Evite
`image-left`/`image-right`: a imagem cobre metade do slide e esconde a faixa e a marca USCS —
use o `figura`.

Campos marcados como "aceita HTML" nos comentários de cada `.vue` são renderizados com
`v-html` — dá para escrever `<span class="ds-em">assim</span>` dentro de um título.

## Componentes

Ficam em `aulas/components/` e são **auto-importados**: basta escrever a tag no markdown.

| componente | quando usar |
|---|---|
| `<Nota>` | o aparte: `tipo` = `info` (padrão), `ok`, `alerta`, `erro` |
| `<Grade>` + `<Cartao>` | comparar coisas do mesmo tipo, 2 ou 3 colunas |
| `<Numero>` | o dado grande com rótulo: média e DP, número de subtestes, faixa etária |
| `<Termo>` | a definição formal — o bloco que a turma copia |
| `<Citacao>` | a palavra de outra pessoa, dentro de um slide com mais coisas |
| `<Pessoa>` | quem é essa gente que a aula cita |
| `<LinhaDoTempo>` | sequência com marcos — história ou processo |
| `<Fala>` + `<Acao>` | roteiro de aplicação: o que o aplicador **diz** (literal, com `quando` opcional) e o que ele **faz** |
| `<Protocolo>` | um quadro do protocolo de registro recriado (`letra`, `titulo`, `compacto`): `<th>` é o impresso, `<td>` o manuscrito, `td.bloq` a célula sombreada, `tr.soma` a linha de totais |
| `<PerfilGrafico>` | o gráfico de perfil do protocolo do WISC: `tipo` = `ponderados` (1–19, por grupo) ou `compostos` (40–160) |
| `<Fonte>` | o crédito no pé do slide — em letra branca, sobre a faixa azul |

## Utilitários

`ds-kicker` (a pílula de contorno laranja da capa do modelo) `ds-lead` `ds-muted` `ds-em`
(laranja no claro, degradê no escuro) `ds-em-2` `ds-grad` (texto em degradê) `ds-fino`
(Poppins Thin) `ds-small` `ds-grid` `ds-stack` `ds-rule`.
O UnoCSS do Slidev também está ligado (`text-sm`, `mt-4`, `grid`…) — use-o para ajuste
pontual, e as classes `ds-*` para o que tem significado editorial.

Para ver tudo renderizado em vez de lido: **`npm run ref`** abre `aulas/_design-system.md`,
que tem um slide por layout e por componente, com a situação de uso nas notas. O nome começa
com `_`, então o site não o publica.

---

## O contrato: `aulas/contratos.mjs`

O que cada layout e cada componente aceita, num formato que o lint lê:

```js
figura: {
  campos: {
    imagem: obrigatorio('imagem'),                 // falta = erro; precisa existir em public/
    legenda: texto,
    lado: { opcoes: ['direita', 'esquerda'] },      // outro valor = erro
  },
},
```

A linguagem completa (texto, número, booleano, imagem, opções, listas, objetos, `bind`,
`posicao`, `corpo: 'proibido'`, `validar()`) está no comentário do topo do arquivo.

`npm run lint`, o build e o GitHub Actions conferem cada slide contra o contrato do seu layout
e cada `<Componente>` contra o dele. **Erro** (campo obrigatório, tipo, valor fora da lista,
atributo numérico sem `:`) bloqueia a publicação; **aviso** (campo que o layout não conhece,
markdown colado na tag, slide institucional fora do lugar) só aparece no log.

O contrato não pode desatualizar: o lint compara cada entrada com o `defineProps` do `.vue`
correspondente e dá erro se um tiver uma prop que o outro não tem. Layout novo sem contrato
gera aviso. `npm test` roda o lint em `scripts/testes/aula-quebrada.md`, um deck com um erro
conhecido por slide, e confere que cada regra dispara.

---

## As armadilhas do Slidev

As quatro coisas abaixo não são opinião de estilo. São comportamentos do Slidev que fazem um
slide sumir ou uma imagem quebrar **só depois de publicado**. `npm run lint` pega as quatro
(a última como aviso).

### 1. `src:` no frontmatter apaga o slide

`src` é o campo com que o Slidev importa **outro arquivo `.md`** no lugar do slide. Um
`src: /foto.png` faz o Slidev tentar importar `/foto.png` como markdown: o slide desaparece do
deck, sem mensagem de erro nenhuma. Por isso o layout `figura` chama o campo de `imagem`.

### 2. Os campos que o Slidev não entrega ao layout

Estes nomes são consumidos pelo Slidev e **nunca chegam como prop**:

```
clicks · clicksStart · disabled · hide · hideInToc · layout · level · preload
routeAlias · src · title · transition · zoom · dragPos · lang · clickAnimation
```

`title` é o caso que mais aparece, porque é natural querer escrever o título do slide no
frontmatter. Ele chega pelo objeto `frontmatter`, que todo layout recebe inteiro:

```vue
const props = defineProps<{ frontmatter?: Record<string, any> }>()
const title = props.frontmatter?.title
```

Todos os layouts daqui fazem assim. O lint reclama de qualquer layout que declare uma prop com
nome reservado.

### 3. Caminho de imagem que chega por prop precisa de `asset()`

O Vite reescreve caminhos que consegue ver no build — `![](/foto.png)` no markdown, ou
`<img src="/foto.png">` escrito literalmente no template. Um caminho que chega por prop é só
uma string em tempo de execução: o Vite não a enxerga, e no GitHub Pages (onde o site vive em
`/<repo>/<slug>/`) o navegador pede a imagem na raiz do domínio e leva 404.

Localmente a base é `/` e tudo funciona — **o erro só aparece depois do deploy.** Por isso
`aulas/lib/asset.ts`, e por isso `figura.vue` e `Pessoa.vue` passam o caminho por ele.

### 4. Markdown dentro de componente precisa de linha em branco

Sem linha em branco, o conteúdo entre as tags é tratado como HTML puro e o `**negrito**`
aparece literal na tela:

```md
<Nota titulo="Assim não">
Isto sai com os **asteriscos** à mostra.
</Nota>

<Nota titulo="Assim sim">

Isto sai com o **negrito** certo.

</Nota>
```

Vale em qualquer nível de aninhamento — `<Cartao>` dentro de `<Grade>` também precisa.

---

## As regras de sempre

- **Todo frontmatter é cercado por `---` em cima e embaixo.** Entre dois slides sem corpo
  aparecem duas linhas `---` seguidas — está certo. Compartilhar um `---` entre dois blocos
  quebra o parse do arquivo inteiro.
- **O bloco de abertura é headmatter e frontmatter do primeiro slide ao mesmo tempo.** O
  `title:` dele é o título do deck **e** o título que a `capa` mostra: não repita o campo.
- **CSS solto num slide é sinal de que falta um layout ou um componente.** A exceção honesta
  é o desenho que só existe naquele slide (o catálogo de cores em `_design-system.md` é um
  exemplo). Se você escreveria o mesmo `<style>` duas vezes, vire componente.
- **Layout novo sem tema precisa de altura.** Sem tema npm, ninguém dá `height` ao
  `.slidev-layout`; o `base.css` já põe `height: 100%`. Um layout que posicione tudo com
  `position: absolute` e sobrescreva isso fica com altura zero — e o fundo some.
- **Imagem de fundo montada em script também passa por `asset()`.** Os layouts escuros fazem
  `` `url("${asset('/uscs-capa.jpg')}")` `` por isso.
- Um layout ou componente novo **ganha um slide em `aulas/_design-system.md`** e **uma
  entrada em `aulas/contratos.mjs`**. É o que mantém o catálogo e o lint confiáveis.
