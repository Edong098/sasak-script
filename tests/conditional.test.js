import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/index.js";
import { output } from "./helpers.js";

test("nested if, else dan scope blok", async () => {
  assert.deepEqual(
    await output(
      'pengaq umur = 18\nlamun (umur >= 17):\n    lamun (umur < 20):\n        gitaq("Dewasa muda")\n    deq:\n        gitaq("Dewasa")\ndeq:\n    gitaq("Belum dewasa")\nlamun (salaq):\n    gitaq("tidak")\ndeq:\n    gitaq("else")',
    ),
    ["Dewasa muda", "else"],
  );
  await assert.rejects(
    run("lamun (tetu):\n    pengaq x = 1\ngitaq(x)"),
    /belum dideklarasikan/,
  );
});
test("boolean, null, prioritas logika, comparison, short circuit", async () => {
  assert.deepEqual(
    await output(
      "gitaq(tetu atau tidakAda)\ngitaq(salaq dan tidakAda)\ngitaq(bukan salaq dan 2 == 2)\ngitaq(deq_araq == deq_araq)\ngitaq(2 != 3)\ngitaq(3 > 2)\ngitaq(2 <= 2)\ngitaq(1 < 2)\ngitaq(tetu atau salaq dan salaq)\ngitaq(deq_araq)",
    ),
    [
      "tetu",
      "salaq",
      "tetu",
      "tetu",
      "tetu",
      "tetu",
      "tetu",
      "tetu",
      "tetu",
      "deq_araq",
    ],
  );
});
for (const source of [
  "lamun (1):\n    gitaq(1)",
  "gitaq(1 dan tetu)",
  "gitaq(bukan 1)",
  'gitaq(1 > "2")',
  "lamun (tetu):\ngitaq(1)",
]) {
  test(`kondisi invalid: ${JSON.stringify(source)}`, async () => {
    await assert.rejects(run(source));
  });
}
