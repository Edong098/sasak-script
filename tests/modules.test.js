import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../src/index.js';

async function fixture(t, files) {
  const dir = await mkdtemp(join(tmpdir(), 'sasak-modules-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await Promise.all(Object.entries(files).map(([name, source]) => writeFile(join(dir, name), source)));
  return dir;
}
test('module scope, ekspor, relatif dan cache satu eksekusi', async t => {
  const dir = await fixture(t, {
    'math.lu': 'gitaq("loaded")\npengaq rahasia = 9\nsugulang pengaq angka = 5\nsugulang gaweq tambah(a, b):\n    sempuleq a + b + rahasia',
    'one.lu': 'temang "./math.lu"\nsugulang gaweq satu():\n    sempuleq tambah(1, 2)',
    'two.lu': 'temang "./math.lu"\nsugulang gaweq dua():\n    sempuleq angka',
  });
  const lines = [];
  await run('temang "./one.lu"\ntemang "./two.lu"\ngitaq(satu())\ngitaq(dua())', { file: join(dir, 'main.lu'), output: x => lines.push(x) });
  assert.deepEqual(lines, ['loaded', '12', '5']);
  await assert.rejects(run('temang "./math.lu"\ngitaq(rahasia)', { file: join(dir, 'main.lu'), output: () => {} }), /belum dideklarasikan/);
});
test('missing, absolute, collision, circular module ditolak', async t => {
  const dir = await fixture(t, { 'a.lu': 'temang "./b.lu"', 'b.lu': 'temang "./a.lu"', 'x.lu': 'sugulang pengaq x = 1' });
  for (const [source, pattern] of [['temang "./a.lu"', /melingkar/], ['temang "./missing.lu"', /tidak dapat dibaca/], ['temang "node:fs"', /relatif/], ['pengaq x = 2\ntemang "./x.lu"', /sudah dideklarasikan/]]) {
    await assert.rejects(run(source, { file: join(dir, 'main.lu') }), pattern);
  }
});
test('try/catch menangkap throw dan runtime error, bukan control signals', async () => {
  const lines = [];
  await run('cobaq:\n    pelewas "Terjadi kesalahan"\nbauang error:\n    gitaq(error)\ncobaq:\n    gitaq(hilang)\nbauang error:\n    gitaq("tertangkap")\ngaweq f():\n    cobaq:\n        sempuleq 7\n    bauang error:\n        sempuleq 0\ngitaq(f())\nsemasih (tetu):\n    cobaq:\n        mengenteng\n    bauang error:\n        gitaq("tidak")', { output: x => lines.push(x) });
  assert.deepEqual(lines, ['Terjadi kesalahan', 'tertangkap', '7']);
  await assert.rejects(run('pelewas "boom"'), e => e.name === 'UncaughtError' && e.line === 1);
  await assert.rejects(run('cobaq:\n    gitaq(1 / 0)\nbauang e:\n    pelewas e'), /Pembagian/);
});
test('import/export hanya di tingkat modul', async () => {
  await assert.rejects(run('gaweq f():\n    temang "./a.lu"'), /tingkat modul/);
  await assert.rejects(run('lamun (tetu):\n    sugulang pengaq x = 1'), /tingkat modul/);
});
