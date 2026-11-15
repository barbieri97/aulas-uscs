// Teste do próprio lint: roda scripts/lint.mjs num deck quebrado de propósito e confere que
// cada erro conhecido aparece. Se uma regra do contrato parar de disparar, este teste falha.
//
//   npm test
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { test } from 'node:test'

const raiz = join(import.meta.dirname, '..', '..')
const deck = join(import.meta.dirname, 'aula-quebrada.md')

const r = spawnSync(process.execPath, [join(raiz, 'scripts', 'lint.mjs'), deck], { encoding: 'utf-8' })
const saida = r.stdout + r.stderr

test('o lint falha (código != 0) num deck quebrado', () => {
  assert.notEqual(r.status, 0, saida)
})

const esperados = [
  // headmatter
  ['erro', /colorSchema: "dark"` não é um valor aceito/],
  // campo com nome errado, com sugestão
  ['aviso', /não tem o campo `subtitulo`.*você quis dizer `subtitle`/],
  // YAML: vírgula sem aspas parte o texto
  ['erro', /`itens\[1\]` tem `três`, que não existe/],
  ['erro', /`itens\[2\]` está sem `tema`/],
  ['erro', /`atual: 5` não aponta para nenhum item/],
  // obrigatórios e opções
  ['erro', /layout `figura` precisa de `imagem:`/],
  ['erro', /`lado: "centro"` não é um valor aceito/],
  ['erro', /layout `secao` precisa de `title:`/],
  // componentes
  ['erro', /<Grade cols="…"> passa texto — escreva `:cols="…"`/],
  ['erro', /<Nota> `tipo: "aviso"` não é um valor aceito/],
  ['aviso', /<Nota> com markdown logo na linha de baixo/],
  ['erro', /<Numero> precisa do atributo `valor`/],
  ['erro', /<Pessoa> `foto: \/nao-existe.jpg` não existe em aulas\/public/],
  ['aviso', /<Pessoa> não tem o atributo `cargo`/],
  ['erro', /<LinhaDoTempo> precisa do atributo `:itens`/],
  // corpo e posição
  ['aviso', /layout `redes` não mostra o corpo/],
  ['aviso', /pede o layout `redes` aqui \(penúltimo slide\)/],
  ['aviso', /pede o layout `encerramento` aqui \(último slide\)/],
]

for (const [nivel, re] of esperados) {
  test(`${nivel}: ${re.source}`, () => {
    const marca = nivel === 'erro' ? '✗' : '!'
    const linhas = saida.split('\n').filter((l) => l.includes(marca))
    assert.ok(linhas.some((l) => re.test(l)), `não encontrei ${re} entre os ${nivel}s:\n${saida}`)
  })
}

test('as aulas de verdade passam sem erro', () => {
  const real = spawnSync(process.execPath, [join(raiz, 'scripts', 'lint.mjs')], { encoding: 'utf-8' })
  assert.equal(real.status, 0, real.stdout + real.stderr)
})
