import test from "node:test";
import assert from "node:assert/strict";
import { run, parse } from "../src/index.js";
import { output } from "./helpers.js";

test("AST for memiliki initializer, condition, update dan continue", () => {
  const loop = parse("untuk (pengaq i = 0; i < 5; i = i + 1):\n    lanjutkan")
    .body[0];
  assert.equal(loop.type, "For");
  assert.equal(loop.initializer.type, "Declaration");
  assert.equal(loop.condition.operator, "<");
  assert.equal(loop.update.type, "Assignment");
  assert.equal(loop.body[0].type, "Continue");
});
test("for counter, continue tetap menjalankan update, break melewati update", async () => {
  assert.deepEqual(
    await output(
      "pengaq updates = 0\ngaweq naik(i):\n    updates = updates + 1\n    sempuleq i + 1\nuntuk (pengaq i = 0; i < 5; i = naik(i)):\n    lamun (i == 1):\n        lanjutkan\n    lamun (i == 3):\n        mengenteng\n    gitaq(i)\ngitaq(updates)",
    ),
    ["0", "2", "3"],
  );
});
test("while continue mengevaluasi ulang kondisi", async () => {
  assert.deepEqual(
    await output(
      "pengaq i = 0\nsemasih (i < 5):\n    i = i + 1\n    lamun (i == 3):\n        lanjutkan\n    gitaq(i)",
    ),
    ["1", "2", "4", "5"],
  );
});
test("nested for dan while hanya mengendalikan loop terdekat", async () => {
  assert.deepEqual(
    await output(
      "untuk (pengaq i = 0; i < 2; i = i + 1):\n    pengaq j = 0\n    semasih (j < 3):\n        j = j + 1\n        lamun (j == 1):\n            lanjutkan\n        lamun (j == 3):\n            mengenteng\n        gitaq(i * 10 + j)",
    ),
    ["2", "12"],
  );
});
test("scope loop dan iterasi baru, condition false, penurunan penghitung", async () => {
  assert.deepEqual(
    await output(
      'pengaq i = 99\nuntuk (pengaq i = 2; i > 0; i = i - 1):\n    pengaq lokal = i\n    gitaq(lokal)\ngitaq(i)\nuntuk (pengaq k = 1; salaq; k = k + 1):\n    gitaq("tidak")',
    ),
    ["2", "1", "99"],
  );
  await assert.rejects(
    run("untuk (pengaq k = 0; k < 1; k = k + 1):\n    gitaq(k)\ngitaq(k)", {
      output: () => {},
    }),
    /belum dideklarasikan/,
  );
});
test("return, try/catch dan continue tidak kehilangan control signal", async () => {
  assert.deepEqual(
    await output(
      'gaweq f():\n    untuk (pengaq i = 0; i < 3; i = i + 1):\n        cobaq:\n            lamun (i == 0):\n                lanjutkan\n            sempuleq i\n        bauang e:\n            gitaq("tidak")\ngitaq(f())',
    ),
    ["1"],
  );
});
test("for di fungsi async dapat menunggu pada setiap iterasi", async () => {
  assert.deepEqual(
    await output(
      "liwatin gaweq nilai(i):\n    sempuleq i\nliwatin gaweq utama():\n    untuk (pengaq i = 0; i < 2; i = i + 1):\n        gitaq(anti nilai(i))\nutama()",
    ),
    ["0", "1"],
  );
});
for (const source of [
  "lanjutkan",
  "lamun (tetu):\n    lanjutkan",
  "untuk (pengaq i = 0; i < 1; i = i + 1):\n    gaweq f():\n        lanjutkan",
  "untuk (pengaq i = 0; i < 1; i = i + 1):\n    gaweq f():\n        mengenteng",
  "untuk (pengaq i = 0; 1; i = i + 1):\n    mengenteng",
  "untuk (i = 0; i < 1; i = i + 1):\n    gitaq(i)",
  "untuk (pengaq i = 0; i < 1; gitaq(i)):\n    gitaq(i)",
  "untuk (pengaq i = 0; i < 1; i = i + 1):\n    gitaq(i);",
  "untuk (pengaq i = 0 i < 1; i = i + 1):\n    gitaq(i)",
  "untuk (;;):\n    gitaq(1)",
]) {
  test(`for/continue invalid: ${JSON.stringify(source)}`, async () => {
    await assert.rejects(
      run(source, { output: () => {} }),
      (e) => e.line >= 1 && e.column >= 1,
    );
  });
}
