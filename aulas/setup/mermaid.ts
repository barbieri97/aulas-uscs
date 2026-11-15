// Diagramas mermaid nas cores da USCS — Poppins, azul #152342 e laranja #EF7D00.
// O Slidev carrega este arquivo sozinho (aulas/setup/mermaid.ts, ao lado dos decks).
import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => ({
  theme: 'base',
  themeVariables: {
    fontFamily: 'Poppins, system-ui, sans-serif',
    fontSize: '15px',
    primaryColor: '#ffffff',
    primaryTextColor: '#152342',
    primaryBorderColor: '#152342',
    secondaryColor: '#fdf0e1',
    tertiaryColor: '#f4f6fa',
    lineColor: '#ef7d00',
    textColor: '#152342',
    clusterBkg: '#f4f6fa',
    clusterBorder: '#dfe3ec',
    edgeLabelBackground: '#ffffff',
  },
}))
