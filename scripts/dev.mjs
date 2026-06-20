import { spawn } from 'node:child_process'

const processes = [
  spawn(process.execPath, ['server/index.mjs'], { stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], { stdio: 'inherit' }),
]

const stop = () => processes.forEach((child) => child.kill('SIGTERM'))
process.on('SIGINT', stop)
process.on('SIGTERM', stop)

for (const child of processes) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      stop()
      process.exitCode = code
    }
  })
}
