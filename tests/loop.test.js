import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/index.js';
const output = async source => { const lines = []; await run(source, { output: x => lines.push(x) }); return lines; };
test('while mengevaluasi ulang kondisi dan assignment', async () => {
  assert.deepEqual(await output('pengaq angka = 1\nsemasih (angka <= 5):\n    gitaq(angka)\n    angka = angka + 1'), ['1', '2', '3', '4', '5']);
});
test('break keluar dari loop terdekat dan scope setiap iterasi', async () => {
  assert.deepEqual(await output('pengaq i = 0\nsemasih (i < 2):\n    pengaq j = 0\n    semasih (tetu):\n        gitaq(i * 10 + j)\n        mengenteng\n    i = i + 1\nsemasih (salaq):\n    gitaq("tidak")'), ['0', '10']);
});
test('break di luar loop dan condition salah tipe ditolak', async () => {
  await assert.rejects(run('mengenteng'), /di dalam loop/);
  await assert.rejects(run('semasih (1):\n    mengenteng'), /tetu atau salaq/);
});
