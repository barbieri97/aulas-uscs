// ============================================================================
// CONTRATOS — o que cada layout e cada componente do design system aceita.
//
// `npm run lint` (e o build, e o GitHub Actions) confere toda aula contra este
// arquivo: campo obrigatório que falta, valor fora da lista, tipo errado, campo
// com nome digitado errado, atributo de componente sem `:`. Erro bloqueia a
// publicação; aviso só aparece no log.
//
// O lint também confere que este arquivo bate com os .vue: todo campo daqui
// precisa existir no `defineProps` do layout/componente, e toda prop declarada
// lá precisa estar aqui. Criou um layout ou uma prop? Atualize o contrato — o
// lint avisa se esquecer.
//
// Mora em aulas/ e não em aulas/layouts/ porque o Slidev carrega como layout
// qualquer .js/.mjs/.ts daquela pasta.
//
// ---------------------------------------------------------------------------
// A linguagem dos campos
//
//   'texto'                      string (número também passa: `numero: 02`)
//   'numero'                     number
//   'booleano'                   true / false
//   'imagem'                     caminho de imagem; se começa com `/`, precisa
//                                existir em aulas/public/
//   { opcoes: ['a', 'b'] }       só um desses valores
//   { lista: <tipo> }            lista; cada item no <tipo>
//   { objeto: { chave: <tipo> } } objeto com essas chaves
//   [<tipo>, <tipo>]             qualquer um dos tipos (ex.: texto OU objeto)
//
// Em qualquer forma de objeto dá para acrescentar:
//   obrigatorio: true            falta = erro
//   min: N                       listas: pelo menos N itens
//   bind: true                   (componentes) o valor é expressão, precisa de `:`
//                                — `cols="3"` passa a string "3", não o número
//
// Por layout:
//   corpo: 'proibido'            o layout ignora o markdown do slide (aviso)
//   posicao: 'primeiro' | 'penultimo' | 'ultimo'   onde ele deve ficar na aula (aviso)
//   validar(fm, slide)           regra que não cabe na linguagem acima; devolve
//                                uma mensagem de erro (ou nada)
//
// `title` é campo reservado do Slidev: os layouts o leem pelo objeto
// `frontmatter`, não por prop — por isso ele aparece aqui sem estar no defineProps.
// ============================================================================

const texto = 'texto'
const obrigatorio = (tipo) => (typeof tipo === 'string' ? { tipo, obrigatorio: true } : { ...tipo, obrigatorio: true })

export const headmatter = {
  // O design system só tem o tema claro nos slides: com `dark`, o texto vira branco
  // sobre o fundo branco da faixa.
  colorSchema: obrigatorio({ opcoes: ['light'] }),
  theme: obrigatorio({ opcoes: ['none'] }),
}

export const layouts = {
  capa: {
    posicao: 'primeiro',
    campos: {
      title: obrigatorio(texto),
      titulo: texto,
      kicker: texto,
      subtitle: texto,
      meta: texto,
    },
  },

  roteiro: {
    campos: {
      title: obrigatorio(texto),
      kicker: texto,
      itens: obrigatorio({
        lista: [texto, { objeto: { tema: obrigatorio(texto), desc: texto } }],
        min: 1,
      }),
      atual: 'numero',
    },
    validar (fm) {
      const n = fm.itens?.length ?? 0
      if (typeof fm.atual === 'number' && (fm.atual < 1 || fm.atual > n)) {
        return `\`atual: ${fm.atual}\` não aponta para nenhum item (a lista tem ${n}; a contagem começa em 1)`
      }
    },
  },

  destaque: {
    campos: {
      title: obrigatorio(texto),
      kicker: texto,
      fonte: texto,
    },
  },

  secao: {
    campos: {
      title: obrigatorio(texto),
      numero: [texto, 'numero'],
      kicker: texto,
      note: texto,
    },
  },

  figura: {
    campos: {
      imagem: obrigatorio('imagem'),
      legenda: texto,
      lado: { opcoes: ['direita', 'esquerda'] },
      ajuste: { opcoes: ['contain', 'cover'] },
    },
  },

  fecho: {
    campos: {
      title: obrigatorio(texto),
      kicker: texto,
      pontos: { lista: texto },
      proximo: texto,
    },
  },

  redes: {
    posicao: 'penultimo',
    corpo: 'proibido',
    campos: {},
  },

  encerramento: {
    posicao: 'ultimo',
    campos: {
      title: texto,
      subtitle: texto,
    },
  },
}

export const componentes = {
  Nota: {
    atributos: {
      tipo: { opcoes: ['info', 'ok', 'alerta', 'erro'] },
      titulo: texto,
    },
  },
  Grade: {
    atributos: {
      cols: { tipo: 'numero', bind: true },
    },
  },
  Cartao: {
    atributos: {
      rotulo: texto,
      titulo: texto,
      destaque: 'booleano',
    },
  },
  Numero: {
    atributos: {
      valor: obrigatorio(texto),
      rotulo: texto,
      detalhe: texto,
    },
  },
  Termo: {
    atributos: {
      palavra: obrigatorio(texto),
      origem: texto,
    },
  },
  Citacao: {
    atributos: {
      autor: texto,
      fonte: texto,
    },
  },
  Pessoa: {
    atributos: {
      nome: obrigatorio(texto),
      papel: texto,
      foto: 'imagem',
    },
  },
  LinhaDoTempo: {
    atributos: {
      itens: { tipo: 'lista', bind: true, obrigatorio: true },
    },
  },
  Fonte: {
    atributos: {},
  },
  Protocolo: {
    atributos: {
      letra: texto,
      titulo: texto,
      compacto: 'booleano',
    },
  },
  PerfilGrafico: {
    atributos: {
      tipo: { opcoes: ['ponderados', 'compostos'] },
      itens: { tipo: 'lista', bind: true, obrigatorio: true },
    },
  },
  Fala: {
    atributos: {
      quando: texto,
    },
  },
  Acao: {
    atributos: {},
  },
}
