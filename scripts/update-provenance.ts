import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dir, '..')
const path = resolve(root, 'provenance.json')
const provenance = JSON.parse(await readFile(path, 'utf8'))
for (const asset of provenance.assets as { path: string; sha256: string }[]) {
  asset.sha256 = createHash('sha256')
    .update(await readFile(resolve(root, asset.path)))
    .digest('hex')
}
await writeFile(path, JSON.stringify(provenance, null, 2) + '\n')
process.stdout.write('Production asset checksums updated. Run bun run verify to validate the film.\n')
