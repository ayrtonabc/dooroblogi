/**
 * Supervisor del servidor estático.
 *
 * El proceso de `serve.cjs` ha muerto varias veces por razones externas
 * (el runtime corta procesos en background). Este supervisor lo relanza
 * solo si se cae, para que el sitio no se quede caído entre builds.
 *
 * Uso: node _tools/serve-supervisor.cjs
 */
const { spawn } = require('node:child_process');
const path = require('node:path');

const SERVER = path.join(__dirname, 'serve.cjs');
const RESTART_DELAY = 1500;

let child = null;
let stopping = false;

function start() {
  if (stopping) return;
  child = spawn(process.execPath, [SERVER], { stdio: 'inherit' });
  child.on('exit', (code, signal) => {
    if (stopping) return;
    console.log(`[supervisor] servidor terminado (code=${code} signal=${signal}) — relanzando en ${RESTART_DELAY} ms`);
    setTimeout(start, RESTART_DELAY);
  });
}

process.on('SIGINT', () => {
  stopping = true;
  child?.kill();
  process.exit(0);
});
process.on('SIGTERM', () => {
  stopping = true;
  child?.kill();
  process.exit(0);
});

console.log('[supervisor] arrancando servidor estático en http://127.0.0.1:4330');
start();
