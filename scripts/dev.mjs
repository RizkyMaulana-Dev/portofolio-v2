import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [
  spawn(npm, ['run', 'dev:api'], { stdio: 'inherit', env: process.env }),
  spawn(npm, ['run', 'dev:web'], { stdio: 'inherit', env: process.env }),
];

let shuttingDown = false;

function shutdown(signal = 'SIGTERM') {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('exit', () => shutdown());

for (const child of children) {
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    if (code === 0 && signal === null) return;
    console.error(`[dev] ${child.spawnargs.join(' ')} stopped (${signal ?? code}).`);
    shutdown();
    process.exitCode = code ?? 1;
  });
}
