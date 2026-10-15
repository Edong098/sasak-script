# Belajar dengan examples Sasak Script

Koleksi ini memiliki **68 program pembelajaran baru**, **1 modul pendukung baru**,
dan **12 file contoh lama** yang tetap dipertahankan. Total **81 file `.lu`**
(79 program dan 2 modul) telah dijalankan melalui CLI pada Linux, dengan output,
stderr, exit code, dan timeout diperiksa. Tidak ada contoh gagal atau belum didukung
yang disamarkan sebagai program berjalan. Native Windows untuk perubahan ini belum diuji.

## Mulai belajar

Gunakan Node.js 24 LTS dari folder repository:

```sh
npm ci
node src/cli/cli.js examples/01-dasar/01-hello-world.lu
npm run examples:test
```

Alternatif setelah `npm link`: `sasak examples/01-dasar/01-hello-world.lu`.
Tingkat **Pemula** mengenalkan satu konsep; **Menengah** menggabungkan konsep;
**Lanjutan** memakai recursion, OOP, modul, async, atau program gabungan.

## Urutan kategori

| Urutan | Folder | Program | Panduan |
| --- | --- | --- | --- |
| Dasar | [01-dasar/](01-dasar/) | 10 | [Belajar dasar](../docs/belajar-dasar.md) |
| Percabangan | [02-percabangan/](02-percabangan/) | 8 | [Belajar percabangan](../docs/percabangan.md) |
| Perulangan | [03-perulangan/](03-perulangan/) | 11 | [Belajar perulangan](../docs/perulangan.md) |
| Fungsi | [04-fungsi/](04-fungsi/) | 8 | [Belajar fungsi](../docs/fungsi.md) |
| Struktur data | [05-struktur-data/](05-struktur-data/) | 9 | [Belajar struktur data](../docs/struktur-data.md) |
| OOP | [06-oop/](06-oop/) | 8 | [Belajar oop](../docs/oop.md) |
| Lanjutan | [07-lanjutan/](07-lanjutan/) | 6 | [Belajar lanjutan](../docs/lanjutan.md) |
| Mini project | [08-mini-project/](08-mini-project/) | 8 | [Belajar mini project](../docs/mini-project.md) |

## Batas fitur yang perlu diketahui

- `untuk`/`lanjutkan` adalah keyword resmi. For memakai header penghitung dengan titik koma, bukan for-each.
- Tidak ada input terminal atau random. Tebak angka dan kuis adalah **simulasi data tetap**, bukan permainan interaktif.
- Belum ada panjang array, append, konversi number ke string, atau format angka. Jumlah data ditulis eksplisit; angka dicetak terpisah dari teks.
- Belum ada persistence/database. Manajemen mahasiswa dan kasir berjalan di memori; data hilang ketika program selesai.
- Impor dibatasi ke folder program dan subfoldernya. Modul matematika baru berada di `07-lanjutan/modules/`.
- Async mendemonstrasikan fungsi/promise/await interpreter, bukan timer, jaringan, atau parallel CPU.
- Batas keamanan default tetap aktif. Semua contoh menggunakan data kecil dan tidak memerlukan peningkatan batas.

Pengembangan selanjutnya yang dapat dirancang terpisah: builtin input terminal,
random dengan seed untuk pengujian, panjang array, konversi/format scalar, dan
penyimpanan berizin. Ini **usulan fitur**, belum tersedia dan tidak diimplementasikan
untuk memaksakan contoh berjalan. [Sintaks resmi](../docs/syntax.md) menjadi acuan.

## Katalog seluruh file

Setiap perintah `node src/cli/cli.js examples/<path>` dijalankan dari root repository.
File modul dapat dijalankan sendiri dengan exit code 0 dan tanpa output; fungsi
export-nya diuji melalui contoh pengimpor. Status **Berjalan** berarti telah diuji
pada mesin Linux sesi ini, bukan klaim bahwa CI Windows terbaru sudah berjalan.

### Dasar

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [01-dasar/01-hello-world.lu](01-dasar/01-hello-world.lu) | Pemula | Mencetak salam ke terminal. | `node src/cli/cli.js examples/01-dasar/01-hello-world.lu` | Berjalan |
| [01-dasar/02-variabel.lu](01-dasar/02-variabel.lu) | Pemula | Mendeklarasikan dan mengubah nilai variabel. | `node src/cli/cli.js examples/01-dasar/02-variabel.lu` | Berjalan |
| [01-dasar/03-tipe-data.lu](01-dasar/03-tipe-data.lu) | Pemula | Mengenali number, string, boolean, dan null. | `node src/cli/cli.js examples/01-dasar/03-tipe-data.lu` | Berjalan |
| [01-dasar/04-operator-aritmatika.lu](01-dasar/04-operator-aritmatika.lu) | Pemula | Menghitung dengan tambah, kurang, kali, bagi, modulo, dan unary. | `node src/cli/cli.js examples/01-dasar/04-operator-aritmatika.lu` | Berjalan |
| [01-dasar/05-operator-perbandingan.lu](01-dasar/05-operator-perbandingan.lu) | Pemula | Membandingkan dua angka tanpa konversi tipe. | `node src/cli/cli.js examples/01-dasar/05-operator-perbandingan.lu` | Berjalan |
| [01-dasar/06-operator-logika.lu](01-dasar/06-operator-logika.lu) | Pemula | Menggunakan dan, atau, dan bukan pada boolean. | `node src/cli/cli.js examples/01-dasar/06-operator-logika.lu` | Berjalan |
| [01-dasar/07-komentar.lu](01-dasar/07-komentar.lu) | Pemula | Menulis komentar tanpa mengubah output program. | `node src/cli/cli.js examples/01-dasar/07-komentar.lu` | Berjalan |
| [01-dasar/08-luas-persegi.lu](01-dasar/08-luas-persegi.lu) | Pemula | Menghitung luas persegi dari panjang sisi. | `node src/cli/cli.js examples/01-dasar/08-luas-persegi.lu` | Berjalan |
| [01-dasar/09-luas-persegi-panjang.lu](01-dasar/09-luas-persegi-panjang.lu) | Pemula | Menghitung luas persegi panjang. | `node src/cli/cli.js examples/01-dasar/09-luas-persegi-panjang.lu` | Berjalan |
| [01-dasar/10-konversi-suhu.lu](01-dasar/10-konversi-suhu.lu) | Pemula | Mengubah suhu Celsius menjadi Fahrenheit. | `node src/cli/cli.js examples/01-dasar/10-konversi-suhu.lu` | Berjalan |

### Percabangan

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [02-percabangan/01-if.lu](02-percabangan/01-if.lu) | Pemula | Menjalankan blok hanya ketika kondisi benar. | `node src/cli/cli.js examples/02-percabangan/01-if.lu` | Berjalan |
| [02-percabangan/02-if-else.lu](02-percabangan/02-if-else.lu) | Pemula | Memilih salah satu dari dua hasil. | `node src/cli/cli.js examples/02-percabangan/02-if-else.lu` | Berjalan |
| [02-percabangan/03-nested-if.lu](02-percabangan/03-nested-if.lu) | Pemula | Memeriksa kondisi di dalam kondisi lain. | `node src/cli/cli.js examples/02-percabangan/03-nested-if.lu` | Berjalan |
| [02-percabangan/04-ganjil-genap.lu](02-percabangan/04-ganjil-genap.lu) | Pemula | Menentukan paritas dengan sisa pembagian. | `node src/cli/cli.js examples/02-percabangan/04-ganjil-genap.lu` | Berjalan |
| [02-percabangan/05-nilai-kelulusan.lu](02-percabangan/05-nilai-kelulusan.lu) | Pemula | Membandingkan nilai dengan batas kelulusan. | `node src/cli/cli.js examples/02-percabangan/05-nilai-kelulusan.lu` | Berjalan |
| [02-percabangan/06-kategori-umur.lu](02-percabangan/06-kategori-umur.lu) | Pemula | Mengelompokkan umur dengan nested if. | `node src/cli/cli.js examples/02-percabangan/06-kategori-umur.lu` | Berjalan |
| [02-percabangan/07-bilangan-terbesar.lu](02-percabangan/07-bilangan-terbesar.lu) | Pemula | Memilih nilai terbesar dari tiga bilangan. | `node src/cli/cli.js examples/02-percabangan/07-bilangan-terbesar.lu` | Berjalan |
| [02-percabangan/08-diskon-belanja.lu](02-percabangan/08-diskon-belanja.lu) | Pemula | Memberikan diskon ketika total melewati batas. | `node src/cli/cli.js examples/02-percabangan/08-diskon-belanja.lu` | Berjalan |

### Perulangan

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [03-perulangan/01-while.lu](03-perulangan/01-while.lu) | Pemula | Mengulang pencetakan angka selama kondisi benar. | `node src/cli/cli.js examples/03-perulangan/01-while.lu` | Berjalan |
| [03-perulangan/02-break.lu](03-perulangan/02-break.lu) | Pemula | Menghentikan loop saat target ditemukan. | `node src/cli/cli.js examples/03-perulangan/02-break.lu` | Berjalan |
| [03-perulangan/03-nested-loop.lu](03-perulangan/03-nested-loop.lu) | Pemula | Membuat pasangan angka melalui dua loop. | `node src/cli/cli.js examples/03-perulangan/03-nested-loop.lu` | Berjalan |
| [03-perulangan/04-bilangan-1-100.lu](03-perulangan/04-bilangan-1-100.lu) | Pemula | Mencetak bilangan 1 sampai 100. | `node src/cli/cli.js examples/03-perulangan/04-bilangan-1-100.lu` | Berjalan |
| [03-perulangan/05-bilangan-genap.lu](03-perulangan/05-bilangan-genap.lu) | Pemula | Mencetak bilangan genap dari 2 sampai 10. | `node src/cli/cli.js examples/03-perulangan/05-bilangan-genap.lu` | Berjalan |
| [03-perulangan/06-tabel-perkalian.lu](03-perulangan/06-tabel-perkalian.lu) | Pemula | Mencetak hasil perkalian 3 dengan 1 sampai 5. | `node src/cli/cli.js examples/03-perulangan/06-tabel-perkalian.lu` | Berjalan |
| [03-perulangan/07-faktorial.lu](03-perulangan/07-faktorial.lu) | Pemula | Menghitung faktorial dengan akumulator loop. | `node src/cli/cli.js examples/03-perulangan/07-faktorial.lu` | Berjalan |
| [03-perulangan/08-deret-fibonacci.lu](03-perulangan/08-deret-fibonacci.lu) | Pemula | Membangun delapan bilangan Fibonacci secara iteratif. | `node src/cli/cli.js examples/03-perulangan/08-deret-fibonacci.lu` | Berjalan |
| [03-perulangan/09-pola-bintang.lu](03-perulangan/09-pola-bintang.lu) | Pemula | Membentuk segitiga bintang dengan nested loop. | `node src/cli/cli.js examples/03-perulangan/09-pola-bintang.lu` | Berjalan |
| [03-perulangan/10-for.lu](03-perulangan/10-for.lu) | Pemula | Menggunakan header untuk: nilai awal, kondisi, dan pembaruan. | `node src/cli/cli.js examples/03-perulangan/10-for.lu` | Berjalan |
| [03-perulangan/11-continue.lu](03-perulangan/11-continue.lu) | Pemula | Melewati angka 3 dengan lanjutkan tanpa menghentikan loop. | `node src/cli/cli.js examples/03-perulangan/11-continue.lu` | Berjalan |

### Fungsi

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [04-fungsi/01-fungsi-dasar.lu](04-fungsi/01-fungsi-dasar.lu) | Pemula | Mendefinisikan dan memanggil fungsi tanpa parameter. | `node src/cli/cli.js examples/04-fungsi/01-fungsi-dasar.lu` | Berjalan |
| [04-fungsi/02-parameter.lu](04-fungsi/02-parameter.lu) | Pemula | Mengirim nama sebagai parameter fungsi. | `node src/cli/cli.js examples/04-fungsi/02-parameter.lu` | Berjalan |
| [04-fungsi/03-return.lu](04-fungsi/03-return.lu) | Pemula | Menggunakan hasil fungsi pada ekspresi berikutnya. | `node src/cli/cli.js examples/04-fungsi/03-return.lu` | Berjalan |
| [04-fungsi/04-scope.lu](04-fungsi/04-scope.lu) | Pemula | Membedakan variabel global dan variabel lokal. | `node src/cli/cli.js examples/04-fungsi/04-scope.lu` | Berjalan |
| [04-fungsi/05-rekursi.lu](04-fungsi/05-rekursi.lu) | Menengah | Memanggil fungsi sendiri dengan kondisi berhenti. | `node src/cli/cli.js examples/04-fungsi/05-rekursi.lu` | Berjalan |
| [04-fungsi/06-faktorial-rekursif.lu](04-fungsi/06-faktorial-rekursif.lu) | Menengah | Menghitung faktorial secara rekursif. | `node src/cli/cli.js examples/04-fungsi/06-faktorial-rekursif.lu` | Berjalan |
| [04-fungsi/07-fibonacci-rekursif.lu](04-fungsi/07-fibonacci-rekursif.lu) | Menengah | Menghitung Fibonacci kecil dengan dua panggilan rekursif. | `node src/cli/cli.js examples/04-fungsi/07-fibonacci-rekursif.lu` | Berjalan |
| [04-fungsi/08-kalkulator-fungsi.lu](04-fungsi/08-kalkulator-fungsi.lu) | Pemula | Memisahkan empat operasi kalkulator ke fungsi. | `node src/cli/cli.js examples/04-fungsi/08-kalkulator-fungsi.lu` | Berjalan |

### Struktur data

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [05-struktur-data/01-array.lu](05-struktur-data/01-array.lu) | Pemula | Menyimpan tiga nama dalam array. | `node src/cli/cli.js examples/05-struktur-data/01-array.lu` | Berjalan |
| [05-struktur-data/02-index-array.lu](05-struktur-data/02-index-array.lu) | Pemula | Membaca elemen array dengan index mulai dari nol. | `node src/cli/cli.js examples/05-struktur-data/02-index-array.lu` | Berjalan |
| [05-struktur-data/03-update-array.lu](05-struktur-data/03-update-array.lu) | Pemula | Mengganti elemen yang sudah ada pada array. | `node src/cli/cli.js examples/05-struktur-data/03-update-array.lu` | Berjalan |
| [05-struktur-data/04-object.lu](05-struktur-data/04-object.lu) | Pemula | Menyimpan dan memperbarui property object. | `node src/cli/cli.js examples/05-struktur-data/04-object.lu` | Berjalan |
| [05-struktur-data/05-nested-array.lu](05-struktur-data/05-nested-array.lu) | Pemula | Membaca matriks melalui dua index. | `node src/cli/cli.js examples/05-struktur-data/05-nested-array.lu` | Berjalan |
| [05-struktur-data/06-pencarian-linear.lu](05-struktur-data/06-pencarian-linear.lu) | Menengah | Mencari nilai dengan memeriksa elemen satu per satu. | `node src/cli/cli.js examples/05-struktur-data/06-pencarian-linear.lu` | Berjalan |
| [05-struktur-data/07-bubble-sort.lu](05-struktur-data/07-bubble-sort.lu) | Menengah | Mengurutkan angka dengan membandingkan pasangan bersebelahan. | `node src/cli/cli.js examples/05-struktur-data/07-bubble-sort.lu` | Berjalan |
| [05-struktur-data/08-selection-sort.lu](05-struktur-data/08-selection-sort.lu) | Menengah | Mengurutkan dengan memilih nilai minimum tiap putaran. | `node src/cli/cli.js examples/05-struktur-data/08-selection-sort.lu` | Berjalan |
| [05-struktur-data/09-statistik-sederhana.lu](05-struktur-data/09-statistik-sederhana.lu) | Menengah | Menghitung jumlah, rata-rata, minimum, dan maksimum. | `node src/cli/cli.js examples/05-struktur-data/09-statistik-sederhana.lu` | Berjalan |

### OOP

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [06-oop/01-class.lu](06-oop/01-class.lu) | Menengah | Mendefinisikan class sebagai cetak biru object. | `node src/cli/cli.js examples/06-oop/01-class.lu` | Berjalan |
| [06-oop/02-object.lu](06-oop/02-object.lu) | Menengah | Membuat dua instance dengan data yang terpisah. | `node src/cli/cli.js examples/06-oop/02-object.lu` | Berjalan |
| [06-oop/03-constructor.lu](06-oop/03-constructor.lu) | Menengah | Mengisi property saat instance dibuat. | `node src/cli/cli.js examples/06-oop/03-constructor.lu` | Berjalan |
| [06-oop/04-method.lu](06-oop/04-method.lu) | Menengah | Mengubah state object melalui method. | `node src/cli/cli.js examples/06-oop/04-method.lu` | Berjalan |
| [06-oop/05-inheritance.lu](06-oop/05-inheritance.lu) | Lanjutan | Mewarisi constructor dan method dari class induk. | `node src/cli/cli.js examples/06-oop/05-inheritance.lu` | Berjalan |
| [06-oop/06-super.lu](06-oop/06-super.lu) | Lanjutan | Memanggil constructor dan method induk melalui lokaq. | `node src/cli/cli.js examples/06-oop/06-super.lu` | Berjalan |
| [06-oop/07-static.lu](06-oop/07-static.lu) | Menengah | Memanggil method class tanpa membuat instance. | `node src/cli/cli.js examples/06-oop/07-static.lu` | Berjalan |
| [06-oop/08-data-mahasiswa.lu](06-oop/08-data-mahasiswa.lu) | Lanjutan | Menyimpan data dan menentukan status mahasiswa lewat class. | `node src/cli/cli.js examples/06-oop/08-data-mahasiswa.lu` | Berjalan |

### Lanjutan

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [07-lanjutan/01-try-catch.lu](07-lanjutan/01-try-catch.lu) | Lanjutan | Menangkap runtime error agar program dapat melanjutkan. | `node src/cli/cli.js examples/07-lanjutan/01-try-catch.lu` | Berjalan |
| [07-lanjutan/02-throw.lu](07-lanjutan/02-throw.lu) | Lanjutan | Melempar dan menangkap pesan validasi buatan sendiri. | `node src/cli/cli.js examples/07-lanjutan/02-throw.lu` | Berjalan |
| [07-lanjutan/03-import-export.lu](07-lanjutan/03-import-export.lu) | Lanjutan | Mengimpor fungsi yang diekspor modul lokal. | `node src/cli/cli.js examples/07-lanjutan/03-import-export.lu` | Berjalan |
| [07-lanjutan/04-async.lu](07-lanjutan/04-async.lu) | Lanjutan | Memulai fungsi async; CLI menunggu tugas selesai. | `node src/cli/cli.js examples/07-lanjutan/04-async.lu` | Berjalan |
| [07-lanjutan/05-await.lu](07-lanjutan/05-await.lu) | Lanjutan | Membuka hasil fungsi async dengan anti. | `node src/cli/cli.js examples/07-lanjutan/05-await.lu` | Berjalan |
| [07-lanjutan/06-modul-matematika.lu](07-lanjutan/06-modul-matematika.lu) | Lanjutan | Menggabungkan beberapa fungsi modul matematika. | `node src/cli/cli.js examples/07-lanjutan/06-modul-matematika.lu` | Berjalan |
| [07-lanjutan/modules/matematika.lu](07-lanjutan/modules/matematika.lu) | Lanjutan | Modul pendukung: menyediakan operasi matematika tanpa output. | `node src/cli/cli.js examples/07-lanjutan/modules/matematika.lu` | Berjalan (modul tanpa output) |

### Mini project

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [08-mini-project/01-kalkulator.lu](08-mini-project/01-kalkulator.lu) | Menengah | Kalkulator empat operasi dengan validasi pembagian nol. | `node src/cli/cli.js examples/08-mini-project/01-kalkulator.lu` | Berjalan |
| [08-mini-project/02-sistem-nilai-siswa.lu](08-mini-project/02-sistem-nilai-siswa.lu) | Menengah | Menghitung nilai berbobot dan kelulusan tiga siswa. | `node src/cli/cli.js examples/08-mini-project/02-sistem-nilai-siswa.lu` | Berjalan |
| [08-mini-project/03-kasir-sederhana.lu](08-mini-project/03-kasir-sederhana.lu) | Menengah | Menghitung total belanja, diskon, pembayaran, dan kembalian. | `node src/cli/cli.js examples/08-mini-project/03-kasir-sederhana.lu` | Berjalan |
| [08-mini-project/04-manajemen-mahasiswa.lu](08-mini-project/04-manajemen-mahasiswa.lu) | Lanjutan | Membuat, memperbarui, dan membaca data mahasiswa di memori. | `node src/cli/cli.js examples/08-mini-project/04-manajemen-mahasiswa.lu` | Berjalan |
| [08-mini-project/05-tebak-angka.lu](08-mini-project/05-tebak-angka.lu) | Menengah | Simulasi tebak angka dengan target dan tebakan tetap, tanpa input/random. | `node src/cli/cli.js examples/08-mini-project/05-tebak-angka.lu` | Berjalan |
| [08-mini-project/06-konversi-suhu.lu](08-mini-project/06-konversi-suhu.lu) | Menengah | Mengonversi suhu dengan tiga fungsi dan data tetap. | `node src/cli/cli.js examples/08-mini-project/06-konversi-suhu.lu` | Berjalan |
| [08-mini-project/07-statistik-nilai.lu](08-mini-project/07-statistik-nilai.lu) | Lanjutan | Merangkum nilai ke object statistik lalu menampilkan hasil. | `node src/cli/cli.js examples/08-mini-project/07-statistik-nilai.lu` | Berjalan |
| [08-mini-project/08-permainan-kuis.lu](08-mini-project/08-permainan-kuis.lu) | Menengah | Simulasi kuis dengan jawaban tersimpan, tanpa input interaktif. | `node src/cli/cli.js examples/08-mini-project/08-permainan-kuis.lu` | Berjalan |

### Contoh lama

| File | Tingkat | Konsep | Perintah | Status |
| --- | --- | --- | --- | --- |
| [async.lu](async.lu) | Contoh lama | Menunggu hasil fungsi async. | `node src/cli/cli.js examples/async.lu` | Berjalan |
| [belajar.lu](belajar.lu) | Contoh lama | Menggabungkan variabel, fungsi, dan percabangan. | `node src/cli/cli.js examples/belajar.lu` | Berjalan |
| [data.lu](data.lu) | Contoh lama | Membaca array dan memperbarui property object. | `node src/cli/cli.js examples/data.lu` | Berjalan |
| [fungsi.lu](fungsi.lu) | Contoh lama | Mengembalikan hasil penjumlahan dua parameter. | `node src/cli/cli.js examples/fungsi.lu` | Berjalan |
| [hello.lu](hello.lu) | Contoh lama | Mencetak salam pertama. | `node src/cli/cli.js examples/hello.lu` | Berjalan |
| [kondisi.lu](kondisi.lu) | Contoh lama | Memilih pesan berdasarkan umur. | `node src/cli/cli.js examples/kondisi.lu` | Berjalan |
| [modul.lu](modul.lu) | Contoh lama | Mengimpor fungsi dan menangkap error. | `node src/cli/cli.js examples/modul.lu` | Berjalan |
| [modules/matematika.lu](modules/matematika.lu) | Contoh lama | Modul pendukung contoh lama: mengekspor penjumlahan. | `node src/cli/cli.js examples/modules/matematika.lu` | Berjalan (modul tanpa output) |
| [oop.lu](oop.lu) | Contoh lama | Mendemonstrasikan inheritance, super, dan static. | `node src/cli/cli.js examples/oop.lu` | Berjalan |
| [persegi.lu](persegi.lu) | Contoh lama | Menghitung luas persegi. | `node src/cli/cli.js examples/persegi.lu` | Berjalan |
| [perulangan.lu](perulangan.lu) | Contoh lama | Mencetak angka 1 sampai 5 dengan while. | `node src/cli/cli.js examples/perulangan.lu` | Berjalan |
| [untuk.lu](untuk.lu) | Contoh lama | Melewati satu iterasi dengan lanjutkan. | `node src/cli/cli.js examples/untuk.lu` | Berjalan |

## Memeriksa output dan error

[expected-output.json](expected-output.json) menyimpan baris output yang diharapkan,
konsep, tingkat, serta peran setiap file. Nilai ekspektasi ditulis dari perhitungan
contoh dan diverifikasi terhadap CLI, bukan disalin otomatis dari output interpreter.

`tests/examples.test.js` menemukan seluruh `.lu` secara rekursif dan memastikan
semuanya terdaftar. Setiap file mendapat proses Node sendiri, timeout 5 detik,
batas buffer 1 MiB, exit code 0, stderr kosong, dan stdout sesuai ekspektasi.
Working directory pengujian adalah temporary directory agar impor tidak bergantung
pada cwd repository. Tiga kasus negatif juga memeriksa pembagian nol, index array
tidak valid, dan modul hilang: exit code 1 dan diagnostik dengan lokasi yang jelas.

Jalankan `npm test` untuk mencakup regresi interpreter dan seluruh contoh lama/baru.
Jangan memakai `npm run examples:test` sebagai pengganti seluruh suite ketika
mengubah lexer, parser, runtime, atau CLI.
