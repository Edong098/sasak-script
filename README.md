# Sasak Script

**Bahasa Lokal, Logika Global.**

Sasak Script adalah bahasa pemrograman edukatif berbasis bahasa Sasak sehari-hari
masyarakat Lombok Utara (**Lotura**). Proyek open-source ini bertujuan membantu
melestarikan bahasa daerah sekaligus mengenalkan logika dasar pemrograman kepada
generasi muda dan pemula.

## Latar belakang

Perkembangan zaman dan teknologi menghadirkan tantangan bagi penggunaan bahasa
daerah di kalangan anak-anak. Sasak Script membawa kosakata yang dekat dengan
kehidupan masyarakat Lombok Utara ke dalam pembelajaran coding: variabel,
kondisi, perulangan, fungsi, hingga pemrograman berorientasi object.

## Mulai menggunakan

Prasyarat: **Node.js 24 LTS** dan npm. Jalankan dari terminal VS Code, PowerShell,
Command Prompt, atau terminal Linux/macOS:

```sh
git clone https://github.com/Edong098/sasak-script.git
cd sasak-script
npm ci
npm test
npm link
sasak --help
sasak --version
sasak examples/belajar.lu
```

`npm link` membuat CLI lokal; pastikan direktori executable npm berada di PATH.
Alternatif tanpa link: `node src/cli/cli.js examples/belajar.lu` atau
`npm start -- examples/belajar.lu`. Tidak ada dependensi eksternal atau tahap build.

```text
pengaq aran = "Ahmad"
pengaq umur = 22

gaweq salam(nama):
    gitaq("Halo " + nama)

salam(aran)

lamun (umur >= 17):
    gitaq("Sudah dewasa")
deq:
    gitaq("Belum dewasa")
```

Output:

```text
Halo Ahmad
Sudah dewasa
```

## Fitur yang tersedia

- Lexer dengan token NEWLINE/INDENT/DEDENT dan lokasi baris/kolom.
- Parser dengan prioritas operator dan AST; interpreter mengevaluasi AST langsung.
- Variabel, assignment, string, number, boolean, null, matematika, dan `gitaq()`.
- Kondisi, logika dengan short circuit, while, for, break, dan continue.
- Fungsi, return, lexical closure, local scope, dan recursion.
- Array/object, indexing, property access, serta assignment.
- Class, constructor, instance, bound method, inheritance, super, dan static method.
- Modul `.lu` relatif, export, cache, try/catch, dan throw.
- Fungsi async serta await melalui promise runtime.

Implementasi menggunakan JavaScript ESM dan Node.js, tanpa `eval()` maupun
`new Function()`. File source menggunakan ekstensi **`.lu`** dan CLI **`sasak`**.

## Dokumentasi dan contoh

- [Tutorial pemula](docs/tutorial.md)
- [Sintaks dan semantik](docs/syntax.md)
- [Keyword resmi](docs/keywords.md)
- [Arsitektur](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Panduan kontribusi](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

Contoh pada `examples/` mencakup matematika, kondisi, loop, fungsi, data, OOP,
modul, async, serta `untuk`/`lanjutkan`; semuanya diuji melalui CLI. Library contoh berada di
`examples/modules/` dan diimpor oleh `examples/modul.lu`.

## Status dan batasan

TASK 01–12 diimplementasikan sebagai **prototipe pengembangan** dengan versi
package `0.1.0-dev.0`, bukan rilis stabil atau package npm yang sudah dipublikasikan.

Indentasi empat spasi, tanpa tab. Ekspresi harus berada pada satu baris. Angka
menggunakan number IEEE-754; bilangan bulat di atas batas safe integer dapat
kehilangan presisi. Belum ada standard library I/O,
array push, top-level await, atau cancellation. Modul melingkar ditolak.
Interpreter tidak membatasi waktu/jumlah iterasi program; loop tak berujung perlu
dihentikan dari terminal. API ini bukan sandbox untuk source yang tidak dipercaya.
Gunakan `gitaq` untuk nilai scalar/elemen data; format cetak seluruh struktur data
belum dijadikan kontrak bahasa stabil.

CI disiapkan untuk Linux dan Windows dengan Node.js 24. Validasi saat pengembangan
ini dilakukan pada Linux, termasuk CRLF dan path berisi spasi; hasil native Windows
menunggu eksekusi CI. Publikasi npm dan release publik membutuhkan persetujuan pemilik.

## Kontribusi dan lisensi

Penutur Lotura, pendidik, pemula, dan pengembang dapat berkontribusi melalui
[Issues](https://github.com/Edong098/sasak-script/issues) dan pull request.
Keyword resmi tidak diganti tanpa persetujuan pemilik proyek.
Sasak Script menggunakan [lisensi MIT](LICENSE).
