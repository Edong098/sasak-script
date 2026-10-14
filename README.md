# Sasak Script

**Bahasa Lokal, Logika Global.**

Sasak Script adalah bahasa pemrograman edukatif berbasis bahasa Sasak sehari-hari
masyarakat Lombok Utara (**Lotura**). Proyek ini mengajak generasi muda dan pemula
belajar logika pemrograman sambil mengenal serta menggunakan bahasa daerahnya.

Implementasi menggunakan **JavaScript dan Node.js**, file program berekstensi
**`.lu`**, dan perintah CLI bernama **`sasak`**.

## Mengapa Sasak Script?

Penggunaan bahasa daerah di kalangan anak-anak menghadapi tantangan seiring
perkembangan teknologi. Sasak Script hadir sebagai sarana pelestarian bahasa
Sasak Lombok Utara sekaligus pembelajaran variabel, kondisi, perulangan, fungsi,
dan konsep pemrograman lainnya melalui kosakata yang dekat dengan kehidupan sehari-hari.

## Instalasi dan penggunaan

Siapkan **Node.js 24 LTS** beserta npm. Buka terminal di VS Code, PowerShell,
Command Prompt, atau terminal Linux/macOS, lalu jalankan:

```sh
git clone https://github.com/Edong098/sasak-script.git
cd sasak-script
npm ci
npm link
sasak examples/belajar.lu
```

`npm link` menghubungkan CLI ke checkout lokal. Pastikan direktori executable npm
berada di `PATH`. Proyek tidak memerlukan dependensi eksternal maupun tahap build.
Paket belum dipublikasikan ke npm; gunakan repository ini untuk instalasi.

Jika tidak menggunakan `npm link`:

```sh
node src/cli/cli.js examples/belajar.lu
# Atau melalui npm:
npm start -- examples/belajar.lu
```

Bantuan dan versi tersedia melalui `sasak --help` serta `sasak --version`.

## Program pertama

Simpan sebagai `belajar.lu`, lalu jalankan `sasak belajar.lu`:

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

Gunakan **empat spasi** untuk setiap tingkat indentasi. Blok diawali titik dua,
komentar diawali `#`, dan pemanggilan fungsi menggunakan tanda kurung.

## Perulangan `untuk` dan `lanjutkan`

```text
untuk (pengaq i = 0; i < 5; i = i + 1):
    lamun (i == 2):
        lanjutkan
    gitaq(i)
```

Output: `0`, `1`, `3`, `4`, masing-masing pada baris baru.

Header `untuk` terdiri dari deklarasi awal, kondisi, dan pembaruan penghitung.
Titik koma hanya digunakan sebagai pemisah bagian header ini. `lanjutkan`
melewati sisa iterasi, sedangkan `mengenteng` menghentikan loop.
`lanjutkan` juga dapat digunakan dalam perulangan `semasih`.

## Fitur yang tersedia

| Fitur | Keyword atau sintaks |
| --- | --- |
| Variabel dan output | `pengaq`, `gitaq()` |
| Boolean dan null | `tetu`, `salaq`, `deq_araq` |
| Kondisi dan logika | `lamun`, `deq`, `dan`, `atau`, `bukan` |
| Perulangan | `semasih`, `untuk`, `mengenteng`, `lanjutkan` |
| Fungsi dan return | `gaweq`, `sempuleq`; lexical scope, closure, recursion |
| Struktur data | Array, object, indexing, property access, assignment |
| Object-oriented programming | `bale`, `sandiang`, `niki`, `jariang`, `tunang`, `lokaq`, `melengo` |
| Modul relatif | `temang`, `sugulang` |
| Penanganan error | `cobaq`, `bauang`, `pelewas` |
| Async dan await | `liwatin`, `anti` |

Program dijalankan melalui **Lexer → Tokens → Parser → AST → Interpreter**,
tanpa `eval()` atau `new Function()`. Error bahasa menyertakan nama file, baris,
dan kolom. CLI keluar dengan status `1` jika program gagal.

## Contoh dan pengujian

Contoh siap dijalankan berada di [`examples/`](examples/), dari matematika hingga OOP,
modul, dan async. Misalnya:

```sh
sasak examples/persegi.lu
sasak examples/untuk.lu
sasak examples/oop.lu
npm test
```

Pengujian menggunakan `node:test` dan mencakup unit test, regresi, serta integrasi
CLI. GitHub Actions dikonfigurasi untuk Node.js 24 pada Linux dan Windows.

## Dokumentasi

- [Tutorial untuk pemula](docs/tutorial.md)
- [Sintaks dan semantik](docs/syntax.md)
- [Kamus keyword resmi](docs/keywords.md)
- [Arsitektur interpreter](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Panduan kontribusi](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## Status pengembangan

Versi **`0.1.0-dev.0`** merupakan prototipe pengembangan. Fitur di atas telah diuji,
namun spesifikasi dan API belum dinyatakan stabil. Belum ada rilis publik atau
publikasi npm.

Batasan saat ini:

- Ekspresi ditulis pada satu baris; indentasi memakai spasi, bukan tab.
- Tidak ada konversi tipe otomatis antara string dan angka.
- Index array harus berada dalam batas; belum tersedia operasi append.
- Impor modul melingkar ditolak; await hanya tersedia dalam fungsi async.
- Belum tersedia standard library I/O, cancellation, atau batas resource eksekusi.
- Angka memakai IEEE-754 sehingga integer besar dapat kehilangan presisi.

Rincian perilaku dan batasan dijelaskan dalam [dokumentasi sintaks](docs/syntax.md).

## Kontribusi

Penutur Lotura, pendidik, pemula, dan pengembang dapat membantu melalui diskusi
kosakata, materi belajar, dokumentasi, atau kode. Ajukan ide melalui
[Issues](https://github.com/Edong098/sasak-script/issues) dan perubahan melalui pull request.
Baca [CONTRIBUTING.md](CONTRIBUTING.md) sebelum berkontribusi; perubahan keyword resmi
memerlukan persetujuan pemilik proyek.

## Lisensi

Sasak Script merupakan proyek open-source dengan [lisensi MIT](LICENSE).
