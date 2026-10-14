# Sasak Script

**Bahasa Lokal, Logika Global.**

Sasak Script adalah proyek bahasa pemrograman edukatif berbasis bahasa Sasak
sehari-hari masyarakat Lombok Utara. Proyek ini bertujuan membantu melestarikan
bahasa daerah sekaligus memperkenalkan logika dasar pemrograman kepada generasi
muda dan pemula.

Dialek awal yang digunakan adalah **Sasak Lombok Utara (Lotura)**. File program
direncanakan menggunakan ekstensi **`.lu`**, dengan CLI bernama **`sasak`**.

## Latar belakang

Seiring perkembangan zaman dan teknologi, penggunaan bahasa daerah di kalangan
anak-anak dan generasi muda menghadapi tantangan. Sasak Script lahir dari
keinginan untuk menghadirkan bahasa Sasak Lombok Utara dalam dunia pemrograman
dan menyediakan sarana belajar yang dekat dengan kehidupan sehari-hari.

Kosakata yang akrab diharapkan membantu pemula memahami variabel, kondisi,
perulangan, fungsi, dan konsep pemrograman lainnya, sambil tetap mengenal dan
menggunakan bahasa daerahnya.

## Tujuan

- Mendukung pelestarian bahasa Sasak sehari-hari masyarakat Lombok Utara.
- Memperkenalkan logika dasar pemrograman dengan bahasa yang dekat dengan pemula.
- Menyediakan sarana edukasi terbuka yang dapat dikembangkan bersama komunitas.

## Teknologi yang direncanakan

- **Bahasa implementasi:** JavaScript.
- **Runtime:** Node.js.
- **Bahasa yang dikembangkan:** Sasak Script.
- **Dialek awal:** Lotura.
- **Ekstensi file:** `.lu`.
- **CLI:** `sasak`.

Fondasi proyek Node.js dan kerangka CLI tersedia. Lexer, parser, dan core interpreter tersedia. Proyek belum dipublikasikan ke npm.

## Menjalankan proyek

Gunakan **Node.js 24 LTS** dan npm bawaannya, termasuk pada Windows melalui
terminal VS Code. Tidak ada dependensi eksternal.

```sh
npm ci
npm start -- --help
npm start -- --version
npm test
```

Alternatif langsung: `node src/cli/cli.js --help`.
Untuk mengaktifkan perintah `sasak` secara lokal, jalankan `npm link` dari
direktori repository, lalu `sasak --help` atau `sasak --version`. Pastikan
direktori executable npm berada dalam `PATH` terminal Anda (termasuk di Windows).
Jalankan `npm start -- examples/hello.lu` atau `sasak examples/persegi.lu`.

## Ilustrasi sintaks

Kata kunci mengikuti [kamus yang ditetapkan](docs/keywords.md).
Contoh berikut sudah dapat dieksekusi dengan core interpreter.

```text
# examples/hello.lu
gitaq("Halo, Sasak Script!")
```

Lihat [sintaks](docs/syntax.md), [arsitektur](docs/architecture.md), dan
[roadmap versi](docs/roadmap.md) untuk rencana pengembangan.

## Roadmap

- [x] Menyiapkan repositori, README, lisensi MIT, dan `.gitignore` Node.js.
- [x] Membangun fondasi proyek Node.js dan kerangka CLI.
- [x] Mendokumentasikan kamus kata kunci dan rancangan sintaks awal.
- [ ] Mengembangkan lexer, parser, dan interpreter secara bertahap.
- [ ] Menghubungkan CLI `sasak` dengan interpreter dan menguji eksekusi `.lu`.
- [ ] Menyusun panduan belajar dan dokumentasi kontribusi.

## Cara berkontribusi

Kontribusi dari penutur Lotura, pendidik, pemula, dan pengembang sangat diterima.
Anda dapat membantu memeriksa kosakata, memberikan ide materi pembelajaran,
memperbaiki dokumentasi, atau mendiskusikan desain bahasa melalui
[Issues](https://github.com/Edong098/sasak-script/issues).

Untuk mengusulkan perubahan, fork repositori, buat branch untuk perubahan Anda,
lalu ajukan pull request dengan penjelasan tujuan dan perubahan yang dilakukan.
Diskusikan perubahan sintaks atau kosakata terlebih dahulu agar sesuai dengan
konteks bahasa masyarakat Lombok Utara.

## Lisensi

Sasak Script adalah proyek open-source dengan lisensi [MIT](LICENSE).
