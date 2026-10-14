import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/cli/cli.js', import.meta.url));
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });

for (const args of [[], ['--help'], ['-h']]) {
  test(`bantuan CLI: ${args.join(' ') || 'tanpa argumen'}`, () => {
    const result = run(...args);
    assert.ifError(result.error);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Sasak Script/);
    assert.match(result.stdout, /file.lu/);
    assert.equal(result.stderr, '');
  });
}
for (const flag of ['--version', '-v']) {
  test(`versi CLI: ${flag}`, () => {
    const result = run(flag);
    assert.ifError(result.error);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, `${version}\n`);
    assert.equal(result.stderr, '');
  });
}
for (const args of [['hello.txt'], ['--unknown'], ['--help', 'hello.lu']]) {
  test(`menolak argumen yang belum didukung: ${args.join(' ')}`, () => {
    const result = run(...args);
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Gunakan satu file/);
  });
}

for (const [file, expected] of [['hello.lu', 'Halo, Sasak Script!\n'], ['persegi.lu', 'Luas persegi:\n25\n']]) {
  test(`CLI mengeksekusi ${file}`, () => {
    const result = run(fileURLToPath(new URL(`../examples/${file}`, import.meta.url)));
    assert.ifError(result.error);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, expected);
    assert.equal(result.stderr, '');
  });
}
test('CLI file hilang menghasilkan diagnostik tanpa stack trace', () => {
  const result = run('tidak-ada.lu');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /tidak-ada.lu:1:1 FileError/);
});
