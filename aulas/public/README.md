# Imagens

**Esta pasta é a `public/` do Slidev.** O Slidev trata a pasta do arquivo `.md` como raiz do
projeto, e as aulas moram em `aulas/` — então é aqui que entram as imagens, e não numa
`public/` na raiz do repositório. O caminho dentro do markdown é absoluto e sem o nome da
pasta: `/curva-normal-qi.svg`.

## Fundos institucionais (não apague)

Extraídos do modelo "Modelos PPT USCS — Fundo Branco". Os layouts os usam sozinhos — você não
precisa referenciá-los nas aulas.

| arquivo | layout | observação |
|---|---|---|
| `uscs-fundo-conteudo.jpg` | todo slide claro | branco + faixa azul + marca "USCS Pós-Graduação" (1920×1080) |
| `uscs-capa.jpg` | `capa` | o texto do modelo foi apagado; a chama ficou |
| `uscs-fundo-escuro.jpg` | `secao`, `destaque` | o fundo do slide de redes, sem os ícones |
| `uscs-redes.jpg` | `redes` | o slide de redes sociais, igual ao modelo |
| `uscs-encerramento.jpg` | `encerramento` | o "Obrigado(a)!" foi apagado (o layout o escreve); os contatos ficaram |

## Imagens das aulas

| arquivo | serve para |
|---|---|
| `curva-normal-qi.svg` | layout `figura` do catálogo `_design-system.md`: curva normal do QI (média 100, DP 15) |
| `autores/*.jpg` | aula 01: retratos de Spearman, Binet, Thurstone, Cattell, Horn e Carroll, extraídos do material de histórico da disciplina |
| `chc/chc-sintese.svg` | aula 01: Cattell-Horn (sem g) + Carroll (com g) → CHC |
| `chc/chc-piramide.svg` | aula 01: os três estratos do CHC (recriação da Figura 1 de Pessotto) |
| `chc/chc-mapa.svg` | aula 01: as 16 capacidades amplas agrupadas por função |
| `chc/chc-investimento.svg` | aula 01: teoria do investimento, Gf → Gc ao longo da idade |

## Duas maneiras de usar, e só uma funciona sempre

```md
![alguma coisa](/curva-normal-qi.svg)   ← o Vite reescreve este caminho no build
```

```md
---
layout: figura
imagem: /curva-normal-qi.svg            ← chega como prop, em tempo de execução
---
```

O segundo caso **só funciona porque o layout passa o caminho por `asset()`**
(`aulas/lib/asset.ts`). Sem isso a imagem some quando o site é publicado num subdiretório —
e localmente continua aparecendo, o que faz o erro só surgir depois do deploy. Qualquer
componente novo que aceite caminho de imagem por prop precisa fazer o mesmo.
