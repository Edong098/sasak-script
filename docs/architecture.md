# Arsitektur

```text
Source Code (.lu) → Lexer → Tokens → Parser → AST → Interpreter → Output
```

Tidak menggunakan eval, Function constructor, atau substitusi keyword menjadi JS.
Node AST berupa data dengan lokasi source. Runtime menangani nilai bahasa sendiri.

| File | Tanggung jawab |
| --- | --- |
| `src/index.js` | API publik tokenize, parse, run, metadata; batas eksekusi utama |
| `src/cli/cli.js` | Help/version, membaca file, menjalankan API dan diagnostik |
| `src/lexer/lexer.js` | Tokenisasi baris, indentasi, escape, lokasi token |
| `src/lexer/tokens.js` | Kamus keyword dan jenis token struktural |
| `src/parser/parser.js` | Recursive descent dan precedence climbing; validasi konteks |
| `src/ast/nodes.js` | Pembuatan node AST dengan lokasi source |
| `src/runtime/interpreter.js` | Eksekusi statement dan evaluasi ekspresi AST |
| `src/runtime/environment.js` | Binding Map, parent scope, deklarasi dan assignment |
| `src/runtime/objects.js` | Class, instance, dan pencarian method diwariskan |
| `src/runtime/modules.js` | Loader path relatif, cache realpath, scope dan siklus |
| `src/runtime/async.js` | Promise runtime dan penuntasan tugas async |
| `src/runtime/budget.js` | Budget bersama dan deadline fatal |
| `src/runtime/source.js` | Pembacaan source biasa dengan ukuran terbatas |
| `src/runtime/signals.js` | Sinyal internal break, continue, return, dan throw |
| `src/errors/SasakError.js` | Error bahasa dengan file/baris/kolom |
| `tests/` | Unit, regresi, dan integrasi CLI dengan node:test |

Parser memeriksa break/return/await berdasarkan konteks lexical. Batas loop
menangkap BreakSignal/ContinueSignal; batas fungsi menangkap ReturnSignal. Catch menangkap
ThrowSignal dan SasakError. Batas CLI mengubah throw tidak tertangkap menjadi
UncaughtError dan exit code 1.

Object literal menggunakan Map agar nama seperti `__proto__` tidak mengakses
prototype host. User function menyimpan closure; bound method juga menyimpan
receiver dan class pemilik untuk resolusi super.

Evaluator menggunakan async JavaScript secara internal agar fungsi bahasa async
bisa ditunggu. SasakPromise merupakan pembungkus; fungsi sync tidak membuka
promise bahasa secara implisit. Scheduler menunggu semua tugas dan melaporkan
rejection tanpa await. Ini bukan transpilation: setiap operasi membaca node AST.

## API

```js
import { tokenize, parse, run } from 'sasak-script';
const tokens = tokenize('gitaq(1)', { file: 'contoh.lu' });
const ast = parse('gitaq(1)', { file: 'contoh.lu' });
await run('gitaq(1)', { file: 'contoh.lu', output: console.log });
```

`run` menghasilkan Promise yang selesai setelah tugas bahasa selesai, dan
mengembalikan Environment global untuk embedding/debugging. `file` menentukan
basis path import. Jika dihilangkan, basisnya working directory. `Interpreter`
adalah API tingkat rendah untuk AST; `run(source, options)` disarankan untuk
penanganan scheduler dan error di batas program. Batas resource dan root modul berlaku bersama untuk lexer, parser, runtime, dan
scheduler. Ini bukan sandbox OS atau API stabil; gunakan proses/container terpisah
untuk input tak dipercaya.
