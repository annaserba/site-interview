import { spawn } from 'node:child_process'

const viteArgs = process.argv.slice(2)
  // 'localhost' резолвится в IPv6 ::1 и Vite слушает только один стек —
  // нормализуем в IPv4 loopback, чтобы превью по 127.0.0.1 всегда работало
  .map((a, i, arr) => (a === 'localhost' && arr[i - 1] === '--host') ? '127.0.0.1' : a)
  .map((a) => a === '--host=localhost' ? '--host=127.0.0.1' : a)

// Backend server is optional for the UI: if its port is already taken
// (e.g. a stale process from a previous run), Vite must keep running.
// RAG-эндпоинты (/api/rag/*) обслуживает сам api.mjs — отдельный
// RAG-процесс (server/index.mjs) в dev не нужен, в проде nginx
// тоже направляет все /api/* на api:3001.
const backends = [
  { name: 'api', child: spawn(process.execPath, ['server/api.mjs'], { stdio: 'inherit' }) },
]
// Дефолтный host подставляем, только если вызывающий не передал свой --host
const hasHostArg = viteArgs.some((a) => a === '--host' || a.startsWith('--host='))
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...(hasHostArg ? [] : ['--host', '127.0.0.1']), ...viteArgs], { stdio: 'inherit' })

const processes = [...backends.map((b) => b.child), vite]

const stop = () => processes.forEach((child) => child.kill('SIGTERM'))
process.on('SIGINT', stop)
process.on('SIGTERM', stop)

for (const { name, child } of backends) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.warn(`[dev] ${name} server exited with code ${code} — continuing without it`)
    }
  })
}

vite.on('exit', (code) => {
  stop()
  process.exitCode = code ?? 0
})
