import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/index.js";
import { output } from "./helpers.js";

test("parameter, return, recursion dan exit dari loop", async () => {
  assert.deepEqual(
    await output(
      "gaweq tambah(a, b):\n    sempuleq a + b\ngaweq faktorial(n):\n    lamun (n <= 1):\n        sempuleq 1\n    sempuleq n * faktorial(n - 1)\ngaweq cari():\n    semasih (tetu):\n        sempuleq 7\ngitaq(tambah(5, 3))\ngitaq(faktorial(6))\ngitaq(cari())",
    ),
    ["8", "720", "7"],
  );
});
test("lexical closure, shadowing, mutation dan implicit null", async () => {
  assert.deepEqual(
    await output(
      "pengaq x = 10\ngaweq baca():\n    sempuleq x\ngaweq pemanggil(x):\n    sempuleq baca()\ngaweq buat():\n    pengaq n = 0\n    gaweq naik():\n        n = n + 1\n        sempuleq n\n    sempuleq naik\npengaq counter = buat()\ngitaq(counter())\ngitaq(counter())\ngitaq(pemanggil(99))\ngaweq kosong():\n    pengaq x = 2\ngitaq(kosong())\ngitaq(x)",
    ),
    ["1", "2", "10", "deq_araq", "10"],
  );
});
for (const source of [
  "sempuleq 1",
  "gaweq f(a, a):\n    sempuleq a",
  "gaweq f(a):\n    sempuleq a\nf()",
  "gaweq f():\n    pengaq lokal = 1\nf()\ngitaq(lokal)",
  "semasih (tetu):\n    gaweq f():\n        mengenteng\n    mengenteng",
]) {
  test(`fungsi invalid: ${JSON.stringify(source)}`, async () => {
    await assert.rejects(run(source));
  });
}
