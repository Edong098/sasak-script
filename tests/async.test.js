import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/index.js";
const output = async (source) => {
  const lines = [];
  await run(source, { output: (x) => lines.push(x) });
  return lines;
};

test("async call menghasilkan promise runtime dan await unwrap", async () => {
  assert.deepEqual(
    await output(
      "liwatin gaweq tambah(a, b):\n    sempuleq a + b\nliwatin gaweq utama():\n    pengaq tugas = tambah(5, 3)\n    gitaq(anti tugas)\nutama()",
    ),
    ["8"],
  );
});
test("await bersarang, async return adoption dan closure", async () => {
  assert.deepEqual(
    await output(
      "liwatin gaweq satu():\n    sempuleq 1\nliwatin gaweq dua():\n    sempuleq satu()\nliwatin gaweq utama():\n    gitaq((anti dua()) + (anti satu()))\nutama()",
    ),
    ["2"],
  );
});
test("async throw, runtime failure dan rethrow ditangkap ketika await", async () => {
  assert.deepEqual(
    await output(
      'liwatin gaweq gagal():\n    pelewas "boom"\nliwatin gaweq utama():\n    cobaq:\n        anti gagal()\n    bauang e:\n        gitaq(e)\n    cobaq:\n        gitaq(1 / 0)\n    bauang e:\n        gitaq("runtime tertangkap")\nutama()',
    ),
    ["boom", "runtime tertangkap"],
  );
  await assert.rejects(
    run('liwatin gaweq gagal():\n    pelewas "boom"\ngagal()'),
    /boom/,
  );
});
test("async method dan async export parser", async () => {
  assert.deepEqual(
    await output(
      "bale A:\n    liwatin gaweq nilai():\n        sempuleq 3\nliwatin gaweq utama():\n    pengaq a = jariang A()\n    gitaq(anti a.nilai())\nutama()",
    ),
    ["3"],
  );
});
for (const source of [
  "anti 1",
  "gaweq f():\n    anti 1",
  "liwatin gaweq f():\n    gaweq g():\n        anti 1",
  "liwatin gaweq f():\n    anti 1\nf()",
  "liwatin gaweq f():\n    sempuleq 1\ngitaq(f())",
]) {
  test(`async invalid: ${JSON.stringify(source)}`, async () => {
    await assert.rejects(run(source));
  });
}
