# Laporan TASK 01–12

Implementasi prototipe selesai pada 14 Oktober 2026. Repository:
https://github.com/Edong098/sasak-script. Pekerjaan TASK 00, MIT, dan gitignore Node.js dipertahankan.

| Task | Hasil | Commit | Total test lulus setelah task |
| --- | --- | --- | --- |
| 01 | Node.js ESM, bin sasak, bantuan/versi, node:test, struktur | 55c3856 | 8 |
| 02 | Lexer, keyword, escape, indentasi dan lokasi | 8e3b574 | 19 |
| 03 | Parser precedence, statement dan AST | 2b0e298 | 28 |
| 04 | Core interpreter dan CLI menjalankan .lu | aa92d67 | 39 |
| 05 | Kondisi dan operator boolean/comparison | 9562386 | 46 |
| 06 | While, nested loop dan break | 8acc174 | 49 |
| 07 | Fungsi, lexical closure, scope dan recursion | 17e38df | 56 |
| 08 | Array/object, index/property dan assignment | af3adea | 67 |
| 09 | Class, constructor, inheritance, super, static | a1fde51 | 78 |
| 10 | Modul, export, cache, try/catch/throw | 80308fb | 82 |
| 11 | Async/await runtime dan error propagation | 0c4eaae | 91 |
| 12 | Integrasi/regresi, tutorial, CI, paket lokal | lihat git log | 109 |

Seluruh task memiliki commit lokal terpisah. Commit TASK 01–12 belum di-push.
Tidak ada npm publish atau release publik.

## File dan folder

- src/lexer, parser, ast, runtime, errors, cli: komponen interpreter modular.
- src/index.js: API publik dan metadata.
- tests/: unit dan integrasi node:test.
- examples/: hello, persegi, kondisi, perulangan, fungsi, belajar, data, OOP, modul, async.
- examples/modules/: library .lu untuk contoh import.
- docs/: sintaks, keywords, arsitektur, roadmap, aturan lexer, tutorial, laporan.
- package.json, package-lock.json, .nvmrc: konfigurasi Node.js 24 LTS.
- README.md, CONTRIBUTING.md, CHANGELOG.md: penggunaan dan kontribusi.
- .github/workflows/test.yml: CI Ubuntu/Windows Node.js 24.

## Bukti validasi

- npm ci dan npm test: 109 pass, 0 fail, 0 skip.
- Sepuluh program contoh diuji melalui proses CLI dengan output yang dibandingkan.
- CRLF, path berisi spasi, import relatif dari working directory berbeda diuji pada Linux.
- npm link dengan prefix lokal berhasil; bantuan/versi dan belajar.lu berjalan.
- npm pack membuat archive lokal dengan 36 file; executable CLI dan whitelist diperiksa.
- Archive dipasang ke prefix terpisah; CLI paket menjalankan belajar.lu dengan hasil yang benar.
- Error bahasa memiliki file, baris, kolom; exit code CLI gagal adalah 1.
- Pengujian menjaga larangan eval/new Function dan memeriksa namespace object tanpa prototype host.

Paket uji dan cache dibuat di /tmp, bukan ditambahkan ke repository. Karena home
cache default tidak dapat ditulis di cloud, npm pack diuji memakai --cache /tmp/sasak-npm-cache.

## Penggunaan

```sh
npm ci
npm test
npm link
sasak examples/belajar.lu
```

Alternatif tanpa link: node src/cli/cli.js examples/belajar.lu.
Hasil: Halo Ahmad, lalu Sudah dewasa pada baris berikutnya.

## Batasan dan tindak lanjut

Windows native belum dijalankan pada sesi ini; CI disiapkan, belum dieksekusi.
Spesifikasi dan API masih prototipe, package tetap private, dan belum ada publikasi.
Indentasi empat spasi, ekspresi satu baris, index array dalam batas, key object
string, modul melingkar ditolak, await hanya di fungsi async. Belum ada keyword
for/continue, standard library I/O, array append, cancellation, atau resource limit.
Number memakai IEEE-754. Format cetak struktur data belum menjadi kontrak stabil.

Berikutnya: jalankan CI pada GitHub, minta masukan penutur Lotura dan pemula,
stabilkan spesifikasi/API, serta rancang standard library dan batas resource.
Rilis/npm tetap menunggu persetujuan pemilik proyek.
