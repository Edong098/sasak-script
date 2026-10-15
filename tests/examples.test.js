import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile, readdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../examples/", import.meta.url));
const cli = fileURLToPath(new URL("../src/cli/cli.js", import.meta.url));
const cases = JSON.parse(
  await readFile(join(root, "expected-output.json"), "utf8"),
);
const invoke = (file) =>
  spawnSync(process.execPath, [cli, file], {
    encoding: "utf8",
    cwd: tmpdir(),
    timeout: 5000,
    maxBuffer: 1024 * 1024,
  });
async function discover(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.equal(
      entry.isSymbolicLink(),
      false,
      "Koleksi contoh tidak memakai symlink",
    );
    const path = prefix + entry.name;
    if (entry.isDirectory())
      files.push(...(await discover(join(directory, entry.name), path + "/")));
    else if (entry.name.endsWith(".lu")) files.push(path);
  }
  return files.sort();
}

test("setiap file .lu terdaftar dan memiliki komentar tujuan serta output", async () => {
  assert.deepEqual(await discover(root), Object.keys(cases).sort());
  for (const [path, example] of Object.entries(cases)) {
    assert.ok(example.concept.length > 0, path);
    assert.ok(["program", "module"].includes(example.role), path);
    assert.ok(Array.isArray(example.expected), path);
    assert.ok(
      example.expected.every(
        (line) => typeof line === "string" && !line.includes("\n"),
      ),
      path,
    );
    const source = await readFile(join(root, ...path.split("/")), "utf8");
    assert.match(source, /^# .+/, path);
  }
});
for (const [path, example] of Object.entries(cases)) {
  test(`contoh CLI: ${path}`, () => {
    const result = invoke(join(root, ...path.split("/")));
    assert.ifError(result.error);
    assert.equal(
      result.signal,
      null,
      "Proses contoh tidak boleh timeout/terbunuh",
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      result.stderr,
      "",
      "Tidak boleh ada error runtime yang tersembunyi",
    );
    const stdout = example.expected.length
      ? example.expected.join("\n") + "\n"
      : "";
    assert.equal(result.stdout, stdout);
  });
}
for (const [name, source, diagnostic] of [
  ["bagi-nol", "gitaq(1 / 0)", /RuntimeError: Pembagian dengan nol/],
  ["index-invalid", "gitaq([1][3])", /RuntimeError: Index array/],
  ["modul-hilang", 'temang "./hilang.lu"', /ModuleError:/],
]) {
  test(`contoh gagal harus melaporkan exit code dan lokasi: ${name}`, async (t) => {
    const dir = await mkdtemp(join(tmpdir(), "sasak-example-error-"));
    t.after(() => rm(dir, { recursive: true, force: true }));
    const file = join(dir, "error.lu");
    await writeFile(file, source);
    const result = invoke(file);
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /error\.lu:1:\d+/);
    assert.match(result.stderr, diagnostic);
  });
}
