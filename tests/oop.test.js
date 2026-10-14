import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/index.js';
const output = async source => { const lines = []; await run(source, { output: x => lines.push(x) }); return lines; };

test('constructor, instance, method dan bound this', async () => {
  assert.deepEqual(await output('bale Manusia:\n    sandiang(aran):\n        niki.aran = aran\n    gaweq salam():\n        gitaq("Halo " + niki.aran)\npengaq orang = jariang Manusia("Ahmad")\norang.salam()\npengaq salam = orang.salam\nsalam()'), ['Halo Ahmad', 'Halo Ahmad']);
});
test('inheritance, super constructor/method, override, static inheritance', async () => {
  assert.deepEqual(await output('bale Induk:\n    sandiang(n):\n        niki.n = n\n    gaweq nilai():\n        sempuleq niki.n\n    melengo gaweq nama():\n        sempuleq "Induk"\nbale Anak tunang Induk:\n    sandiang(n):\n        lokaq(n + 1)\n    gaweq nilai():\n        sempuleq lokaq.nilai() * 2\npengaq anak = jariang Anak(5)\ngitaq(anak.nilai())\ngitaq(Anak.nama())'), ['12', 'Induk']);
});
test('constructor diwariskan dan instance saling terpisah', async () => {
  assert.deepEqual(await output('bale A:\n    sandiang(x):\n        niki.x = x\nbale B tunang A:\n    gaweq nilai():\n        sempuleq niki.x\npengaq a = jariang B(1)\npengaq b = jariang B(2)\na.x = 3\ngitaq(a.nilai())\ngitaq(b.nilai())'), ['3', '2']);
});
for (const source of ['jariang TidakAda()', 'pengaq A = 1\njariang A()', 'bale B tunang TidakAda:\n    gaweq f():\n        sempuleq 1', 'gitaq(niki)', 'gitaq(lokaq)', 'bale A:\n    gaweq f():\n        sempuleq 1\njariang A(1)', 'bale A:\n    gaweq f():\n        sempuleq 1\npengaq a = jariang A()\na.hilang()', 'bale A:\n    gaweq f():\n        sempuleq 1\n    gaweq f():\n        sempuleq 2']) {
  test(`OOP invalid: ${JSON.stringify(source)}`, async () => { await assert.rejects(run(source)); });
}
