// Confere slides e componentes contra aulas/contratos.mjs.
//
// Este arquivo não sabe o nome de nenhum layout: tudo o que ele valida vem do contrato.
// Sem aulas/contratos.mjs (um tema npm, por exemplo), as checagens daqui simplesmente
// não rodam — o lint genérico de scripts/lint.mjs continua valendo.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getDefaultConfig } from '@slidev/parser'
import { aulasDir, componentsDir, layoutsDir, publicDir, vueNames } from './lib.mjs'

const arquivoContrato = join(aulasDir, 'contratos.mjs')

/** O contrato, ou null se o design system não tiver um. */
export async function carregarContratos () {
  if (!existsSync(arquivoContrato)) return null
  const mod = await import(pathToFileURL(arquivoContrato).href)
  return {
    headmatter: mod.headmatter ?? {},
    layouts: mod.layouts ?? {},
    componentes: mod.componentes ?? {},
  }
}

// ------------------------------------------------------------------ campos que não são do layout

/**
 * Campos que o Slidev (e não o layout) consome em qualquer slide. Não contam como
 * "campo desconhecido" mesmo que o contrato não os liste.
 */
const CAMPOS_DO_SLIDEV = new Set([
  'clicks', 'clicksStart', 'disabled', 'hide', 'hideInToc', 'layout', 'level', 'preload',
  'routeAlias', 'src', 'title', 'transition', 'zoom', 'dragPos', 'lang', 'clickAnimation',
  'class', 'background', 'layoutClass', 'name',
])

/** No primeiro slide, o bloco também é headmatter: as chaves de configuração do deck valem. */
const CAMPOS_DE_HEADMATTER = new Set([
  ...Object.keys(getDefaultConfig()),
  'keywords', 'defaults', 'date', 'titleTemplate',
])

// ------------------------------------------------------------------ tipos

/** Normaliza as formas curtas do contrato ('texto', [a, b]) para { tipo, ... }. */
function norm (spec) {
  if (typeof spec === 'string') return { tipo: spec }
  if (Array.isArray(spec)) return { umDe: spec }
  return spec
}

const descrever = (spec) => {
  const s = norm(spec)
  if (s.umDe) return s.umDe.map(descrever).join(' ou ')
  if (s.opcoes) return s.opcoes.map((o) => `\`${o}\``).join(' | ')
  if (s.lista !== undefined) return `lista de ${descrever(s.lista)}`
  if (s.objeto) return `{ ${Object.keys(s.objeto).join(', ')} }`
  return s.tipo
}

/**
 * Confere `valor` contra `spec`. Devolve a lista de problemas (strings); vazia = ok.
 * `onde` é o nome do campo, para a mensagem.
 */
function checarValor (valor, spec, onde) {
  const s = norm(spec)

  if (s.umDe) {
    const algum = s.umDe.some((alt) => checarValor(valor, alt, onde).length === 0)
    if (algum) return []
    // Se só um dos tipos é objeto e o valor é objeto, o erro dele é o mais útil.
    const objeto = s.umDe.find((alt) => norm(alt).objeto)
    if (objeto && valor && typeof valor === 'object' && !Array.isArray(valor)) return checarValor(valor, objeto, onde)
    return [`\`${onde}\` precisa ser ${descrever(s)}`]
  }

  if (s.opcoes) {
    return s.opcoes.includes(valor)
      ? []
      : [`\`${onde}: ${JSON.stringify(valor)}\` não é um valor aceito — use ${descrever(s)}`]
  }

  if (s.lista !== undefined || s.tipo === 'lista') {
    if (!Array.isArray(valor)) return [`\`${onde}\` precisa ser uma lista (itens com \`- \`)`]
    const problemas = []
    if (s.min && valor.length < s.min) problemas.push(`\`${onde}\` precisa de pelo menos ${s.min} item(ns)`)
    if (s.lista !== undefined) {
      valor.forEach((item, i) => problemas.push(...checarValor(item, s.lista, `${onde}[${i + 1}]`)))
    }
    return problemas
  }

  if (s.objeto) {
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return [`\`${onde}\` precisa ser ${descrever(s)}`]
    const problemas = []
    for (const [chave, sub] of Object.entries(s.objeto)) {
      if (valor[chave] === undefined || valor[chave] === null || valor[chave] === '') {
        if (norm(sub).obrigatorio) problemas.push(`\`${onde}\` está sem \`${chave}\``)
      } else {
        problemas.push(...checarValor(valor[chave], sub, `${onde}.${chave}`))
      }
    }
    for (const chave of Object.keys(valor)) {
      if (!(chave in s.objeto)) problemas.push(`\`${onde}\` tem \`${chave}\`, que não existe — use ${Object.keys(s.objeto).map((k) => `\`${k}\``).join(', ')}`)
    }
    return problemas
  }

  switch (s.tipo) {
    case 'texto':
      return typeof valor === 'string' || typeof valor === 'number' ? [] : [`\`${onde}\` precisa ser texto`]
    case 'numero':
      return typeof valor === 'number' ? [] : [`\`${onde}\` precisa ser um número (sem aspas)`]
    case 'booleano':
      return typeof valor === 'boolean' ? [] : [`\`${onde}\` precisa ser \`true\` ou \`false\``]
    case 'imagem': {
      if (typeof valor !== 'string') return [`\`${onde}\` precisa ser o caminho de uma imagem`]
      if (valor.startsWith('/') && !valor.startsWith('//') && !existsSync(join(publicDir, valor.slice(1)))) {
        return [`\`${onde}: ${valor}\` não existe em aulas/public/`]
      }
      if (!valor.startsWith('/') && !/^https?:\/\//.test(valor)) {
        return [`\`${onde}: ${valor}\` precisa começar com \`/\` (arquivo de aulas/public/) ou ser uma URL`]
      }
      return []
    }
    default:
      return []
  }
}

// ------------------------------------------------------------------ sugestão para nome digitado errado

function distancia (a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return d[a.length][b.length]
}

function sugestao (nome, validos) {
  const [melhor] = [...validos]
    .map((v) => [v, distancia(nome.toLowerCase(), v.toLowerCase())])
    .sort((x, y) => x[1] - y[1])
  return melhor && melhor[1] <= Math.max(2, Math.floor(nome.length / 3)) ? ` — você quis dizer \`${melhor[0]}\`?` : ''
}

// ------------------------------------------------------------------ headmatter e slides

export function checarHeadmatter (head, contratos, erro) {
  for (const [campo, spec] of Object.entries(contratos.headmatter)) {
    const valor = head[campo]
    if (valor === undefined) {
      if (norm(spec).obrigatorio) erro(`falta \`${campo}:\` no headmatter — aceito: ${descrever(spec)}`, 1)
      continue
    }
    for (const msg of checarValor(valor, spec, campo)) erro(`headmatter: ${msg}`, 1)
  }
}

/**
 * Confere um slide contra o contrato do seu layout.
 * `ctx` = { indice, total, bancada, erro, aviso, linha, onde, conteudo }
 */
export function checarSlide (slide, contratos, ctx) {
  const { erro, aviso, linha, onde } = ctx
  const fm = slide.frontmatter ?? {}
  const nomeLayout = fm.layout ?? (ctx.indice === 0 ? 'cover' : 'default')
  const contrato = contratos.layouts[fm.layout]

  // --- posição na aula (só em aula publicada; o catálogo mistura tudo) ------------
  if (!ctx.bancada) {
    for (const [nome, c] of Object.entries(contratos.layouts)) {
      const esperado = { primeiro: 0, penultimo: ctx.total - 2, ultimo: ctx.total - 1 }[c.posicao]
      if (esperado === ctx.indice && nomeLayout !== nome) {
        aviso(`${onde}: o modelo da USCS pede o layout \`${nome}\` aqui (${{ primeiro: 'primeiro', penultimo: 'penúltimo', ultimo: 'último' }[c.posicao]} slide), e este é \`${nomeLayout}\``, linha)
      }
    }
  }

  if (!contrato) return

  const campos = contrato.campos ?? {}

  // --- obrigatórios, tipos, valores ------------------------------------------------
  for (const [campo, spec] of Object.entries(campos)) {
    const valor = fm[campo]
    if (valor === undefined || valor === null || valor === '') {
      if (norm(spec).obrigatorio) {
        erro(`${onde}: o layout \`${fm.layout}\` precisa de \`${campo}:\` (${descrever(spec)})`, linha)
      }
      continue
    }
    for (const msg of checarValor(valor, spec, campo)) erro(`${onde}: ${msg}`, linha)
  }

  // --- campos que o layout não conhece: quase sempre nome digitado errado ---------
  for (const campo of Object.keys(fm)) {
    if (campo in campos || CAMPOS_DO_SLIDEV.has(campo)) continue
    if (ctx.indice === 0 && CAMPOS_DE_HEADMATTER.has(campo)) continue
    aviso(`${onde}: o layout \`${fm.layout}\` não tem o campo \`${campo}\` — ele será ignorado${sugestao(campo, Object.keys(campos))}`, linha)
  }

  // --- corpo -------------------------------------------------------------------------
  if (contrato.corpo === 'proibido' && ctx.conteudo.trim()) {
    aviso(`${onde}: o layout \`${fm.layout}\` não mostra o corpo do slide — o texto escrito aqui não aparece`, linha)
  }

  // --- regra própria -------------------------------------------------------------------
  const msg = contrato.validar?.(fm, slide)
  if (msg) erro(`${onde}: ${msg}`, linha)
}

// ------------------------------------------------------------------ componentes no markdown

const RE_ATRIBUTO = /([:@]?[\w.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g

/** Atributos que qualquer tag aceita e que não são prop do componente. */
const ATRIBUTOS_LIVRES = /^(class|style|key|ref|id|v-[\w-]+|:class|:style|:key)$/

/**
 * Lê as tags `<Componente ...>` de um trecho de markdown. Aceita atributo em várias
 * linhas (`<LinhaDoTempo :itens="[ ... ]" />`).
 */
function tagsDe (texto, nomes) {
  const tags = []
  const re = /<([A-Z][A-Za-z0-9]*)\b((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g
  for (const m of texto.matchAll(re)) {
    if (!nomes.has(m[1])) continue
    const atributos = {}
    for (const a of m[2].matchAll(RE_ATRIBUTO)) {
      atributos[a[1]] = a[2] ?? a[3] ?? true
    }
    tags.push({ nome: m[1], atributos, fechada: m[3] === '/', fim: m.index + m[0].length, inicio: m.index })
  }
  return tags
}

/** Converte o valor estático de um atributo para checar contra o tipo. */
function valorEstatico (bruto, spec) {
  if (bruto === true) return norm(spec).tipo === 'booleano' ? true : ''
  return bruto
}

export function checarComponentes (conteudo, contratos, ctx) {
  const { erro, aviso, linha, onde } = ctx
  const nomes = new Set(Object.keys(contratos.componentes))

  for (const tag of tagsDe(conteudo, nomes)) {
    const contrato = contratos.componentes[tag.nome]
    const atributos = contrato.atributos ?? {}

    for (const [attr, spec] of Object.entries(atributos)) {
      const s = norm(spec)
      const estatico = tag.atributos[attr]
      const dinamico = tag.atributos[`:${attr}`] ?? tag.atributos[`v-bind:${attr}`]

      if (estatico === undefined && dinamico === undefined) {
        if (s.obrigatorio) erro(`${onde}: <${tag.nome}> precisa do atributo \`${s.bind ? ':' : ''}${attr}\``, linha)
        continue
      }

      if (estatico !== undefined) {
        // `cols="3"` passa a STRING "3": o atributo precisa do `:` para virar número/lista.
        if (s.bind || s.tipo === 'numero' || s.tipo === 'lista') {
          erro(`${onde}: <${tag.nome} ${attr}="…"> passa texto — escreva \`:${attr}="…"\` (com dois-pontos)`, linha)
          continue
        }
        for (const msg of checarValor(valorEstatico(estatico, s), spec, attr)) erro(`${onde}: <${tag.nome}> ${msg}`, linha)
      }
    }

    for (const attr of Object.keys(tag.atributos)) {
      const base = attr.replace(/^(:|v-bind:)/, '')
      if (base in atributos || ATRIBUTOS_LIVRES.test(attr)) continue
      aviso(`${onde}: <${tag.nome}> não tem o atributo \`${base}\` — ele será ignorado${sugestao(base, Object.keys(atributos))}`, linha)
    }

    // Markdown dentro do componente sem linha em branco depois da tag de abertura:
    // o Slidev trata o trecho como HTML e o **negrito** aparece com os asteriscos.
    if (!tag.fechada) {
      const depois = conteudo.slice(tag.fim)
      const proxima = depois.startsWith('\n') ? depois.slice(1).split('\n')[0] : depois.split('\n')[0]
      if (proxima.trim() && !proxima.trim().startsWith('<') && /(\*\*|__|`|\[.+\]\(|^\s*[-*] |^\s*\d+\. |^#)/.test(proxima)) {
        aviso(`${onde}: <${tag.nome}> com markdown logo na linha de baixo — deixe uma linha em branco depois da tag, senão a formatação aparece crua`, linha)
      }
    }
  }
}

// ------------------------------------------------------------------ contrato × .vue

/** As props declaradas no `defineProps<{...}>` de um .vue (só as chaves do primeiro nível). */
function propsDoVue (arquivo) {
  const src = readFileSync(arquivo, 'utf-8')
  const bloco = /defineProps<\{([\s\S]*?)\}>/.exec(src)
  if (!bloco) return []
  // Separa em trechos só no nível 0 — `itens?: (string | { tema?: string })[]` não pode
  // virar as props `tema`.
  const trechos = []
  let atual = ''
  let profundidade = 0
  for (const c of bloco[1]) {
    if ('({[<'.includes(c)) profundidade++
    if (')}]>'.includes(c)) profundidade--
    if (profundidade === 0 && '\n,;'.includes(c)) {
      trechos.push(atual)
      atual = ''
    } else {
      atual += c
    }
  }
  trechos.push(atual)
  return trechos
    .map((t) => /^\s*([A-Za-z_]\w*)\??\s*:/.exec(t)?.[1])
    .filter((nome, i, todos) => nome && todos.indexOf(nome) === i)
}

/**
 * Confere que o contrato descreve os .vue que existem — e só eles. É o que impede o
 * contrato de apodrecer quando alguém cria uma prop nova e esquece de registrá-la.
 */
export function checarContratoContraVue (contratos) {
  const problemas = []
  const grupos = [
    ['layout', layoutsDir, contratos.layouts, 'campos'],
    ['componente', componentsDir, contratos.componentes, 'atributos'],
  ]

  for (const [tipo, dir, mapa, chave] of grupos) {
    const existentes = new Set(vueNames(dir))

    for (const nome of existentes) {
      if (!mapa[nome]) {
        problemas.push({ nivel: 'aviso', msg: `${tipo} \`${nome}\` não tem contrato em aulas/contratos.mjs — o lint não confere os campos dele` })
        continue
      }
      const declarados = Object.keys(mapa[nome][chave] ?? {}).filter((c) => c !== 'title')
      const props = propsDoVue(join(dir, `${nome}.vue`)).filter((p) => p !== 'frontmatter')
      for (const c of declarados) {
        if (!props.includes(c)) problemas.push({ nivel: 'erro', msg: `contrato do ${tipo} \`${nome}\` tem \`${c}\`, mas ${nome}.vue não declara essa prop` })
      }
      for (const p of props) {
        if (!declarados.includes(p)) problemas.push({ nivel: 'erro', msg: `${nome}.vue declara a prop \`${p}\`, que não está no contrato do ${tipo} em aulas/contratos.mjs` })
      }
    }

    for (const nome of Object.keys(mapa)) {
      if (!existentes.has(nome)) problemas.push({ nivel: 'erro', msg: `aulas/contratos.mjs descreve o ${tipo} \`${nome}\`, que não existe em ${tipo === 'layout' ? 'aulas/layouts/' : 'aulas/components/'}` })
    }
  }
  return problemas
}
