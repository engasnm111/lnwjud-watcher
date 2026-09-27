import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const directory = join('release-desktop', 'win-unpacked')
const executable = readdirSync(directory).find(
  (name) => name.endsWith('.exe') && !name.startsWith('Uninstall'),
)

if (!executable) {
  throw new Error('Packaged Windows executable is missing')
}

const result = spawnSync(
  join(directory, executable),
  ['-e', 'process.stdout.write("watcher-runtime-ok")'],
  {
    encoding: 'utf8',
    timeout: 30_000,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  },
)

if (result.error || result.status !== 0 || result.stdout !== 'watcher-runtime-ok') {
  throw new Error(
    `Packaged Windows runtime failed: ${result.error?.message ?? result.stderr ?? result.status}`,
  )
}

process.stdout.write(`Verified ${executable}: packaged Electron runtime started\n`)
