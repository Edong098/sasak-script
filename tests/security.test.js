import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { run, parse, tokenize } from "../src/index.js";

const cli = fileURLToPath(new URL("../src/cli/cli.js", import.meta.url));
const fatal = (error) =>
  error.name === "LimitError" &&
  error.fatal &&
  error.line >= 1 &&
  error.column >= 1;
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), "sasak-security-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}
test("traversal keluar root ditolak sebelum source dibaca atau dieksekusi", async (t) => {
  const dir = await fixture(t);
  const root = join(dir, "project");
  await mkdir(root);
  await writeFile(join(dir, "outside.lu"), 'gitaq("tidak boleh")');
  const lines = [];
  await assert.rejects(
    run('temang "../outside.lu"', {
      file: join(root, "main.lu"),
      output: (x) => lines.push(x),
    }),
    /di luar folder program/,
  );
  assert.deepEqual(lines, []);
});
test("symlink keluar root ditolak", async (t) => {
  const dir = await fixture(t);
  const root = join(dir, "project");
  await mkdir(root);
  const outside = join(dir, "outside.lu");
  await writeFile(outside, 'gitaq("tidak boleh")');
  try {
    await symlink(outside, join(root, "link.lu"), "file");
  } catch (error) {
    if (error.code === "EPERM") {
      t.skip("Host Windows tidak mengizinkan pembuatan symlink.");
      return;
    }
    throw error;
  }
  await assert.rejects(
    run('temang "./link.lu"', { file: join(root, "main.lu") }),
    /di luar folder program/,
  );
});
test("import ../ tetap legal di dalam root canonical", async (t) => {
  const dir = await fixture(t);
  await mkdir(join(dir, "sub"));
  await writeFile(join(dir, "lib.lu"), "sugulang pengaq n = 7");
  await writeFile(
    join(dir, "sub", "helper.lu"),
    'temang "../lib.lu"\nsugulang pengaq angka = n',
  );
  const lines = [];
  await run('temang "./sub/helper.lu"\ngitaq(angka)', {
    file: join(dir, "main.lu"),
    output: (x) => lines.push(x),
  });
  assert.deepEqual(lines, ["7"]);
});
test("batas file/token/sintaks dicek sebelum interpreter", () => {
  assert.throws(
    () => tokenize('gitaq("besar")', { limits: { sourceBytes: 5 } }),
    fatal,
  );
  assert.throws(() => tokenize("1 + 2", { limits: { tokens: 2 } }), fatal);
  assert.throws(() => parse("(".repeat(300) + "1" + ")".repeat(300)), fatal);
  assert.throws(() => parse("-".repeat(300) + "1"), fatal);
});
test("loop tak berujung dihentikan, LimitError tidak bisa ditelan catch", async () => {
  await assert.rejects(
    run(
      'semasih (tetu):\n    cobaq:\n        gitaq(1)\n    bauang e:\n        gitaq("lanjut")',
      { limits: { steps: 100 }, output: () => {} },
    ),
    fatal,
  );
});
test("recursion dan AST binary mendalam dihentikan tanpa stack overflow", async () => {
  await assert.rejects(run("gaweq f():\n    sempuleq f()\nf()"), fatal);
  await assert.rejects(
    run("gitaq(" + Array(1000).fill("1").join("+") + ")"),
    fatal,
  );
});
test("batas string dan output mencegah pertumbuhan berlebihan", async () => {
  await assert.rejects(
    run('pengaq s = "a"\nsemasih (tetu):\n    s = s + s', {
      limits: { stringLength: 64 },
    }),
    fatal,
  );
  await assert.rejects(
    run('gitaq("123456")\ngitaq("123456")', {
      limits: { outputBytes: 10 },
      output: () => {},
    }),
    fatal,
  );
});
test("array berulang/cyclic tidak membuka ekspansi output tak terbatas", async () => {
  await assert.rejects(
    run(
      "pengaq a = [1]\nuntuk (pengaq i = 0; i < 30; i = i + 1):\n    a = [a, a]\ngitaq(a)",
      { limits: { steps: 1000 }, output: () => {} },
    ),
    fatal,
  );
  const lines = [];
  await run("pengaq a = [deq_araq]\na[0] = a\ngitaq(a)", {
    output: (x) => lines.push(x),
  });
  assert.deepEqual(lines, [""]);
});
test("tasks async dan budget tidak dapat direset dengan membuat fungsi baru", async () => {
  await assert.rejects(
    run(
      "liwatin gaweq f():\n    sempuleq 1\nuntuk (pengaq i = 0; i < 10; i = i + 1):\n    f()",
      { limits: { tasks: 3 } },
    ),
    fatal,
  );
  await assert.rejects(
    run("liwatin gaweq f():\n    semasih (tetu):\n        pengaq x = 1\nf()", {
      limits: { steps: 100 },
    }),
    fatal,
  );
});
test("budget modul dan token digunakan bersama antar file", async (t) => {
  const dir = await fixture(t);
  await writeFile(join(dir, "a.lu"), 'temang "./b.lu"');
  await writeFile(join(dir, "b.lu"), "gitaq(1)");
  await assert.rejects(
    run('temang "./a.lu"', {
      file: join(dir, "main.lu"),
      limits: { modules: 1 },
    }),
    fatal,
  );
  await assert.rejects(
    run('temang "./a.lu"', {
      file: join(dir, "main.lu"),
      limits: { tokens: 8 },
    }),
    fatal,
  );
});
test("file import besar/direktori ditolak; root invalid tidak membuat unhandled rejection", async (t) => {
  const dir = await fixture(t);
  await writeFile(join(dir, "large.lu"), "#" + "a".repeat(262144));
  await mkdir(join(dir, "folder.lu"));
  await assert.rejects(
    run('temang "./large.lu"', { file: join(dir, "main.lu") }),
    fatal,
  );
  await assert.rejects(
    run('temang "./folder.lu"', { file: join(dir, "main.lu") }),
    /file biasa/,
  );
  await run("", { moduleRoot: join(dir, "missing") });
  await assert.rejects(
    run('temang "./large.lu"', {
      file: join(dir, "main.lu"),
      moduleRoot: join(dir, "missing"),
    }),
    /Folder modul/,
  );
});
test("host JS, shell, filesystem, prototype tidak dapat diakses", async () => {
  for (const source of [
    "gitaq(process)",
    "gitaq(require)",
    "gitaq(globalThis)",
    "gitaq(gitaq.constructor)",
    'temang "./malware.js"',
    'pengaq o = {}\no.__proto__ = {"polluted": tetu}\ngitaq({}.polluted)',
  ]) {
    await assert.rejects(run(source));
  }
  assert.equal({}.polluted, undefined);
});
test("CLI menghentikan loop default dan menolak file besar", async (t) => {
  const dir = await fixture(t);
  const file = join(dir, "loop.lu");
  await writeFile(file, "semasih (tetu):\n    pengaq x = 1");
  const loop = spawnSync(process.execPath, [cli, file], {
    encoding: "utf8",
    timeout: 5000,
  });
  assert.ifError(loop.error);
  assert.equal(loop.status, 1);
  assert.match(loop.stderr, /LimitError/);
  await writeFile(file, "#" + "a".repeat(262144));
  const large = spawnSync(process.execPath, [cli, file], {
    encoding: "utf8",
    timeout: 5000,
  });
  assert.ifError(large.error);
  assert.equal(large.status, 1);
  assert.match(large.stderr, /batas ukuran/);
});
test("deadline eksekusi berlaku walaupun budget langkah besar", async () => {
  await assert.rejects(
    run("semasih (tetu):\n    pengaq x = 1", {
      limits: { durationMs: 1, steps: 10000000 },
    }),
    (e) => fatal(e) && /waktu/.test(e.message),
  );
});
test("kontrol terminal di output dan pesan error dibuat terlihat", async (t) => {
  const dir = await fixture(t);
  const file = join(dir, "terminal.lu");
  await writeFile(file, 'gitaq("\x1b]52;c;evil\x07")');
  const result = spawnSync(process.execPath, [cli, file], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.stdout, /[\x1b\x07]/);
  assert.match(result.stdout, /\\u001b/);
  await writeFile(file, 'pelewas "\x1b[2J"');
  const error = spawnSync(process.execPath, [cli, file], { encoding: "utf8" });
  assert.equal(error.status, 1);
  assert.doesNotMatch(error.stderr, /\x1b/);
});

test("promise yang menunggu dirinya sendiri tidak dapat melewati deadline", async () => {
  await assert.rejects(
    run(
      "pengaq tugas = deq_araq\nliwatin gaweq siap():\n    sempuleq 1\nliwatin gaweq tunggu():\n    anti siap()\n    sempuleq anti tugas\ntugas = tunggu()",
      { limits: { durationMs: 30 } },
    ),
    (error) => fatal(error) && /waktu/.test(error.message),
  );
});

test("hierarki class panjang tidak memakai recursion host untuk lookup", async () => {
  const lines = [];
  await run(
    "bale Base:\n    sandiang():\n        niki.x = 7\n    gaweq nilai():\n        sempuleq niki.x\npengaq Last = Base\nuntuk (pengaq i = 0; i < 3000; i = i + 1):\n    bale Next tunang Last:\n        gaweq sendiri():\n            sempuleq 0\n    Last = Next\npengaq object = jariang Last()\ngitaq(object.nilai())",
    { output: (x) => lines.push(x) },
  );
  assert.deepEqual(lines, ["7"]);
});
