import test from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/index.js";
import { output } from "./helpers.js";

test("array/object nested, assignment dan referensi", async () => {
  assert.deepEqual(
    await output(
      'pengaq angka = [10, 20, 30]\ngitaq(angka[0])\nangka[1] = 99\npengaq orang = {"aran": "Ahmad", "data": [angka]}\ngitaq(orang.aran)\norang.aran = "Ali"\norang.baru = 7\ngitaq(orang["aran"])\ngitaq(orang.data[0][1])\ngitaq(orang.baru)\npengaq alias = angka\nalias[0] = 12\ngitaq(angka[0])',
    ),
    ["10", "Ahmad", "Ali", "99", "7", "12"],
  );
});
test("nama object tidak membuka prototype JavaScript", async () => {
  assert.deepEqual(
    await output(
      'pengaq o = {"__proto__": 1, "constructor": 2}\ngitaq(o.__proto__)\ngitaq(o.constructor)',
    ),
    ["1", "2"],
  );
});
for (const source of [
  "gitaq([1][1])",
  "gitaq([1][-1])",
  "gitaq([1][0.5])",
  'gitaq([1]["0"])',
  "gitaq({}.hilang)",
  "gitaq({}[1])",
  "gitaq(1.x)",
  "pengaq a = []\na[0] = 1",
  'pengaq o = {"a": 1, "a": 2}',
]) {
  test(`akses data invalid: ${JSON.stringify(source)}`, async () => {
    await assert.rejects(run(source));
  });
}
