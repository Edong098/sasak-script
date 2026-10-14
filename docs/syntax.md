# Sintaks dan semantik Sasak Script

Dokumen ini menjelaskan prototipe yang diuji melalui `npm test`.

## Source dan blok

- Ekstensi `.lu`; identifier ASCII, case-sensitive; keyword resmi dicadangkan.
- Empat spasi per tingkat indentasi; tab dan lompatan indentasi ditolak.
- Blok dimulai dengan `:` dan wajib memiliki statement.
- LF/CRLF diterima. Baris kosong dan komentar saja tidak mengubah indentasi.
- Satu statement per baris; titik koma hanya memisahkan header `untuk`. Ekspresi lintas baris dan trailing comma tidak didukung.
- Komentar dimulai `#` di luar string. Posisi error dihitung dari 1.
- String petik tunggal/ganda satu baris dengan escape backslash, petik, n, r, t.
- Number desimal seperti `12` dan `12.5`; minus adalah unary operator. Tidak ada exponent, hex, atau separator underscore.

## Nilai dan operator

Literal boolean: `tetu` / `salaq`; null: `deq_araq`.
Deklarasi membutuhkan initializer: `pengaq angka = 1`. Assignment hanya ke nama
yang sudah dideklarasikan, index, atau property. Deklarasi nama yang sama dalam
scope yang sama ditolak; scope turunan dapat melakukan shadowing.

Prioritas operator dari rendah ke tinggi:

| Operator | Perilaku |
| --- | --- |
| `atau` | OR boolean, short circuit |
| `dan` | AND boolean, short circuit |
| `== !=` | Equality tanpa konversi; struktur data berdasarkan identitas |
| `< > <= >=` | Membandingkan dua number atau dua string |
| `+ -` | Number; `+` juga menggabungkan dua string |
| `* / %` | Number; pembagian/modulo nol ditolak |
| unary `+ - bukan anti` | Unary number, NOT boolean, atau await |
| call / indexing / property | Evaluasi berantai dari kiri ke kanan |

Binary operator bersifat left-associative; gunakan tanda kurung untuk grouping.
Tidak ada konversi implisit string/number. Number adalah JavaScript IEEE-754;
hasil tidak berhingga ditolak, tetapi presisi integer besar tetap terbatas.
`gitaq(nilai)` menerima tepat satu argumen dan mencetak satu baris. Boolean/null
 dicetak dengan kata kunci Sasak; fungsi tanpa return menghasilkan `deq_araq`.

## Kondisi dan loop

```text
lamun (umur >= 17):
    gitaq("Dewasa")
deq:
    gitaq("Belum dewasa")

semasih (angka <= 5):
    gitaq(angka)
    angka = angka + 1
```

Kondisi hanya menerima boolean. Scope blok lokal; assignment mencari binding
lexical terdekat. Setiap iterasi memperoleh scope baru. `mengenteng` keluar dari
loop terdekat, dan ditolak di luar loop atau melintasi batas fungsi.

```text
untuk (pengaq i = 0; i < 5; i = i + 1):
    lamun (i == 2):
        lanjutkan
    gitaq(i)
```

Header `untuk` terdiri dari deklarasi `pengaq`, kondisi boolean, dan assignment
pembaruan; ketiganya wajib ditulis. Initializer dijalankan sekali. Kondisi diperiksa
sebelum setiap iterasi. Variabel penghitung hanya berlaku di scope loop, sedangkan
body mendapat scope baru pada setiap iterasi. `lanjutkan` melewati sisa body dan
menjalankan pembaruan sebelum kondisi diperiksa lagi. `mengenteng` keluar tanpa
menjalankan pembaruan. Pada `semasih`, `lanjutkan` langsung memeriksa ulang kondisi.
Keduanya berlaku pada loop terdekat dan tidak bisa melintasi batas fungsi.


## Fungsi

```text
gaweq tambah(a, b):
    sempuleq a + b

gitaq(tambah(5, 3))
```

Jumlah argumen harus tepat; parameter duplikat ditolak. Fungsi menangkap scope
lexical berdasarkan referensi, mendukung recursion, dan dapat disimpan/dikembalikan
sebagai nilai. Evaluasi argumen dari kiri ke kanan. `sempuleq` kosong atau akhir
fungsi menghasilkan null. Return di luar fungsi ditolak, termasuk dalam kode yang
belum tentu dieksekusi. Return dan break tidak ditangkap oleh try/catch.

## Struktur data

```text
pengaq angka = [10, 20, 30]
angka[1] = 99
pengaq orang = {"aran": "Ahmad"}
orang.aran = "Ali"
gitaq(orang["aran"])
```

Array adalah referensi dengan index integer 0 sampai panjang-1. Tidak ada append
atau sparse array. Object memakai key string, mendukung nested data dan property
baru lewat assignment. Key literal wajib string dan tidak boleh duplikat. Property
hilang menimbulkan error. Object tidak mengekspos prototype host JavaScript.

## Class

```text
bale Manusia:
    sandiang(aran):
        niki.aran = aran
    gaweq salam():
        gitaq("Halo " + niki.aran)
    melengo gaweq jenis():
        sempuleq "Manusia"

bale Pelajar tunang Manusia:
    sandiang(aran):
        lokaq(aran)
    gaweq salam():
        lokaq.salam()

pengaq orang = jariang Pelajar("Ahmad")
orang.salam()
gitaq(Pelajar.jenis())
```

`niki` terikat ke receiver, termasuk method yang disimpan sebagai variabel.
`lokaq(argumen)` hanya di constructor instance dan memanggil constructor induk;
`lokaq.nama()` memilih method induk. Static method diwariskan dan dipanggil lewat
class. Constructor tidak dapat async. Class tanpa constructor mewarisi constructor
terdekat, atau menerima nol argumen. Nilai return constructor diabaikan. Field
instance terpisah dan bisa menutupi method. Tidak ada multiple inheritance.

## Modul

Isi `matematika.lu`:

```text
sugulang gaweq tambah(a, b):
    sempuleq a + b
```

File pengimpor:

```text
temang "./matematika.lu"
gitaq(tambah(5, 3))
```

Import/export hanya di tingkat modul. Ekspor dapat berupa deklarasi `pengaq`,
`gaweq`, `liwatin gaweq`, atau `bale`. Semua nama ekspor diikat pada scope pengimpor;
konflik nama ditolak. Hanya path relatif `./` atau `../` dengan ekstensi `.lu`,
relatif ke file pengimpor. Import dibatasi ke folder file utama setelah resolusi realpath, termasuk symlink.
Path `../` hanya legal jika masih di dalam folder tersebut. Cache per eksekusi
memakai realpath; siklus ditolak.
Ekspor adalah snapshot nilai saat deklarasi, bukan live binding; object tetap
berbagi referensi. Nama internal modul tidak bocor. Tidak ada import package npm.

## Error

```text
cobaq:
    pelewas "Terjadi kesalahan"
bauang error:
    gitaq(error)
```

Throw menerima nilai bahasa. Catch menerima nilai throw apa adanya; runtime
error menjadi string lokasi dan pesan. Catch memiliki scope lokal. `LimitError` bersifat fatal dan tidak bisa ditangkap. Error tidak
tertangkap membuat CLI keluar dengan status 1. Syntax error di file utama terjadi
sebelum eksekusi dan tidak dapat ditangkap oleh file yang sama. Syntax error modul
impor bisa ditangkap saat import. Error CLI menyertakan file, baris, dan kolom,
tanpa stack trace internal.

## Async

```text
liwatin gaweq tambah(a, b):
    sempuleq a + b
liwatin gaweq utama():
    pengaq tugas = tambah(5, 3)
    gitaq(anti tugas)
utama()
```

Pemanggilan async memulai tugas dan menghasilkan promise runtime. `anti` hanya di
fungsi async dan hanya menerima promise runtime. Async method ditulis
`liwatin gaweq nama():` atau `melengo liwatin gaweq nama():`.
Return promise dari fungsi async mengadopsi hasilnya. Error tertunda muncul ketika
await dan dapat ditangkap. CLI menunggu seluruh tugas sebelum selesai; rejection
tanpa await menyebabkan program gagal. Evaluasi setiap fungsi berurutan, dengan
penjadwalan kooperatif melalui promise host, tanpa menerjemahkan source ke JS.
Tidak ada top-level await, cancellation, timer, jaringan, filesystem builtin, atau
parallel CPU execution. `gitaq` tidak mencetak promise yang belum dibuka.

## Batas eksekusi

Batas default CLI/API berlaku bersama untuk seluruh modul dan fungsi async:

| Resource | Batas |
| --- | --- |
| Ukuran setiap source | 256 KiB; hanya file biasa |
| Total token | 50.000 |
| Kedalaman parser | 128 |
| Langkah eksekusi | 100.000 |
| Waktu | 2 detik, termasuk penantian promise |
| Pemanggilan fungsi aktif | 128 |
| Evaluasi AST aktif/kedalaman cetak | 256 |
| Impor modul baru | 64 |
| Tugas async | 1.024 |
| Panjang string | 1.048.576 unit UTF-16 |
| Output runtime | 1 MiB UTF-8 |

LimitError menghentikan program; try/catch tidak dapat memulihkan budget.
Format array dicetak melalui traversal terbatas, termasuk penanganan siklus.
CLI mengubah karakter kontrol terminal menjadi teks escape pada output/diagnostik.
Batas ini mengurangi risiko denial of service, tetapi tidak menggantikan isolasi OS.

Embedding tepercaya dapat mengatur `limits` dan `moduleRoot` melalui API `run`:

```js
await run(source, {
  file: '/project/main.lu',
  moduleRoot: '/project',
  limits: { steps: 200000, durationMs: 5000 },
});
```

`moduleRoot` default adalah folder canonical file utama, atau working directory
bila tidak ada file. Hanya host tepercaya yang boleh memperluas root/batas.
Program `.lu` tidak bisa mengubahnya. Tetap gunakan proses terpisah untuk input
berbahaya; callback output dan kode JavaScript host berada di luar batas bahasa.
