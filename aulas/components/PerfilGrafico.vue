<!--
  <PerfilGrafico> — os gráficos de perfil do Protocolo de Registro do WISC-IV,
  recriados: "Perfil dos Pontos Ponderados dos Subtestes" (quadro E) e
  "Perfil dos Pontos Compostos" (quadro F).

  <PerfilGrafico tipo="ponderados" :itens="[
    { sigla: 'SM', valor: 12, grupo: 'Compreensão Verbal' },
    { sigla: 'IN', valor: null, grupo: 'Compreensão Verbal', suplementar: true },
    { sigla: 'CB', valor: 9, grupo: 'Organização Perceptual' },
  ]" />

  <PerfilGrafico tipo="compostos" :itens="[
    { sigla: 'ICV', valor: 112 }, { sigla: 'QIT', valor: 101 },
  ]" />

  - `tipo="ponderados"`: escala 1–19, faixa da média (10) pintada; colunas
    agrupadas por `grupo`, com o nome do grupo no cabeçalho.
  - `tipo="compostos"`: escala 40–160 com marcas de 5 em 5, linha da média (100).
  - `suplementar: true` põe a sigla entre parênteses e desenha o ponto vazado,
    fora da linha — como no impresso, a linha liga só os principais.
  - `valor: null` (subteste não aplicado) deixa a coluna em branco.
  A linha liga itens vizinhos do mesmo `grupo` (sem grupo = todos ligados).
-->
<script setup lang="ts">
import { computed } from 'vue'

type Item = { sigla: string, valor?: number | null, grupo?: string, suplementar?: boolean }

const props = defineProps<{
  tipo?: 'ponderados' | 'compostos'
  itens?: Item[]
}>()

const ehComposto = computed(() => props.tipo === 'compostos')
const min = computed(() => (ehComposto.value ? 40 : 1))
const max = computed(() => (ehComposto.value ? 160 : 19))
const media = computed(() => (ehComposto.value ? 100 : 10))
const lista = computed(() => props.itens ?? [])

// Geometria em unidades do viewBox — o SVG escala com a largura disponível.
const W = 400
const eixo = 26 // coluna dos números à esquerda
const hGrupo = computed(() => (ehComposto.value ? 0 : 26))
const hLinha = 14 // linhas de sigla e de valor no cabeçalho
const topo = computed(() => hGrupo.value + 2 * hLinha + 10)
const hPlot = computed(() => (ehComposto.value ? 260 : 266))
const H = computed(() => topo.value + hPlot.value + 8)
const colW = computed(() => (W - eixo) / Math.max(lista.value.length, 1))

const xDe = (i: number) => eixo + colW.value * (i + 0.5)
const yDe = (v: number) =>
  topo.value + ((max.value - v) / (max.value - min.value)) * hPlot.value

const marcas = computed(() => {
  const passo = ehComposto.value ? 5 : 1
  const out: { v: number, rotulo: boolean }[] = []
  for (let v = min.value; v <= max.value; v += passo)
    out.push({ v, rotulo: ehComposto.value ? v % 10 === 0 : true })
  return out
})

// Blocos de colunas do mesmo grupo, para o cabeçalho e os fios divisórios.
const grupos = computed(() => {
  const out: { nome: string, ini: number, fim: number }[] = []
  lista.value.forEach((it, i) => {
    const nome = it.grupo ?? ''
    const ultimo = out[out.length - 1]
    if (ultimo && ultimo.nome === nome) ultimo.fim = i
    else out.push({ nome, ini: i, fim: i })
  })
  return out
})

const segmentos = computed(() => {
  const out: { x1: number, y1: number, x2: number, y2: number }[] = []
  let ant: { i: number, it: Item } | null = null
  lista.value.forEach((it, i) => {
    const valido = typeof it.valor === 'number' && !it.suplementar
    if (!valido) return
    if (ant && (ant.it.grupo ?? '') === (it.grupo ?? ''))
      out.push({ x1: xDe(ant.i), y1: yDe(ant.it.valor as number), x2: xDe(i), y2: yDe(it.valor as number) })
    ant = { i, it }
  })
  return out
})

// Nome do grupo em duas linhas, quebrado no espaço mais perto do meio — no
// impresso "Velocidade de Processamento" ocupa só três colunas estreitas.
const linhas = (nome: string) => {
  const meio = nome.length / 2
  let corte = -1
  for (let i = 0; i < nome.length; i++)
    if (nome[i] === ' ' && (corte < 0 || Math.abs(i - meio) < Math.abs(corte - meio))) corte = i
  return corte < 0 ? [nome] : [nome.slice(0, corte), nome.slice(corte + 1)]
}

const sigla = (it: Item) => (it.suplementar ? `(${it.sigla})` : it.sigla)
</script>

<template>
  <svg class="ds-perfil" :viewBox="`0 0 ${W} ${H}`" role="img"
    :aria-label="ehComposto ? 'Perfil dos pontos compostos' : 'Perfil dos pontos ponderados dos subtestes'">
    <!-- faixa / linha da média -->
    <rect v-if="!ehComposto" class="media-faixa" :x="eixo" :width="W - eixo"
      :y="yDe(media) - hPlot / 36" :height="hPlot / 18" />
    <line v-else class="media-linha" :x1="eixo" :x2="W" :y1="yDe(media)" :y2="yDe(media)" />

    <!-- cabeçalho: grupo, sigla, valor -->
    <g v-for="g in grupos" :key="`g${g.ini}`">
      <text v-if="!ehComposto" class="grupo" :y="linhas(g.nome).length > 1 ? 10 : 16">
        <tspan v-for="(l, k) in linhas(g.nome)" :key="k" :x="(xDe(g.ini) + xDe(g.fim)) / 2" :dy="k ? 10 : 0">{{ l }}</tspan>
      </text>
      <line v-if="g.ini > 0" class="divisa" :x1="eixo + colW * g.ini" :x2="eixo + colW * g.ini" y1="0" :y2="H - 8" />
    </g>
    <g v-for="(it, i) in lista" :key="`c${i}`">
      <text class="sigla" :x="xDe(i)" :y="hGrupo + hLinha - 3">{{ sigla(it) }}</text>
      <text class="valor" :x="xDe(i)" :y="hGrupo + 2 * hLinha - 3">{{ it.valor ?? '' }}</text>
      <line v-if="ehComposto && i > 0" class="divisa" :x1="eixo + colW * i" :x2="eixo + colW * i" y1="0" :y2="H - 8" />
    </g>
    <line class="fio" :x1="eixo" :x2="W" :y1="hGrupo + 2 * hLinha + 2" :y2="hGrupo + 2 * hLinha + 2" />
    <line v-if="!ehComposto" class="fio" :x1="eixo" :x2="W" :y1="hGrupo" :y2="hGrupo" />
    <line class="fio" :x1="eixo" :x2="eixo" y1="0" :y2="H - 8" />

    <!-- escala -->
    <g v-for="m in marcas" :key="`m${m.v}`">
      <text v-if="m.rotulo" class="escala" :x="eixo - 5" :y="yDe(m.v) + 3">{{ m.v }}</text>
      <template v-if="ehComposto">
        <line v-for="(_, i) in lista" :key="`t${m.v}-${i}`" class="tique"
          :x1="xDe(i) - (m.rotulo ? 6 : 3)" :x2="xDe(i) + (m.rotulo ? 6 : 3)" :y1="yDe(m.v)" :y2="yDe(m.v)" />
      </template>
      <template v-else>
        <circle v-for="(_, i) in lista" :key="`t${m.v}-${i}`" class="grade" :cx="xDe(i)" :cy="yDe(m.v)" r="0.9" />
      </template>
    </g>

    <!-- o perfil -->
    <line v-for="(s, i) in segmentos" :key="`s${i}`" class="perfil" v-bind="s" />
    <template v-for="(it, i) in lista" :key="`p${i}`">
      <circle v-if="typeof it.valor === 'number'" class="ponto" :class="{ sup: it.suplementar }"
        :cx="xDe(i)" :cy="yDe(it.valor)" r="3.6" />
    </template>
  </svg>
</template>

<style scoped>
.ds-perfil {
  display: block;
  width: 100%;
  height: auto;
  /* Cabe abaixo de um título sem descer até a faixa azul; mais estreito que isso,
     a largura manda. */
  max-height: 18.5rem;
  font-family: var(--ds-font-sans);
}

.grupo,
.sigla,
.valor {
  text-anchor: middle;
}

.grupo {
  fill: var(--ds-ink);
  font-size: 7.5px;
  font-weight: var(--ds-peso-forte);
}

.sigla {
  fill: var(--ds-ink);
  font-size: 8px;
}

.valor {
  fill: var(--ds-accent-texto);
  font-size: 9px;
  font-weight: var(--ds-peso-forte);
}

.escala {
  fill: var(--ds-muted);
  font-size: 8px;
  text-anchor: end;
}

.fio,
.divisa {
  stroke: var(--ds-ink);
  stroke-width: 0.8;
}

.tique {
  stroke: var(--ds-muted);
  stroke-width: 0.6;
}

.grade {
  fill: var(--ds-muted);
}

.media-faixa {
  fill: color-mix(in srgb, var(--uscs-azul) 16%, transparent);
}

.media-linha {
  stroke: var(--ds-ink);
  stroke-width: 1;
}

.perfil {
  stroke: var(--ds-accent);
  stroke-width: 2;
  stroke-linecap: round;
}

.ponto {
  fill: var(--ds-accent);
  stroke: var(--ds-bg);
  stroke-width: 1;
}

.ponto.sup {
  fill: var(--ds-bg);
  stroke: var(--ds-accent);
  stroke-width: 1.6;
}
</style>
