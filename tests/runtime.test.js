import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/index.js";
import { output } from "./helpers.js";

test("variabel, assignment, matematika, string dan builtin", async () => {
  assert.deepEqual(
    await output(
      'pengaq n = 2\nn = (n + 3) * 4\ngitaq(n)\ngitaq(7 / 2)\ngitaq(7 % 2)\ngitaq(-3)\ngitaq("Halo " + "Ahmad")',
    ),
    ["20", "3.5", "1", "-3", "Halo Ahmad"],
  );
});
for (const source of [
  "gitaq(a)",
  "a = 2",
  "pengaq a = 1\npengaq a = 2",
  "gitaq(1 / 0)",
  'gitaq("1" + 2)',
  "gitaq()",
  "pengaq n = 1\nn()",
]) {
  test(`runtime menolak ${JSON.stringify(source)}`, async () => {
    await assert.rejects(
      run(source),
      (e) => e.name === "RuntimeError" && e.line >= 1 && e.column >= 1,
    );
  });
}
