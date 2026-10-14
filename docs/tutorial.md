# Tutorial Sasak Script untuk pemula

Sasak Script memakai kosakata Lotura untuk belajar logika coding.
Install Node.js 24 LTS, buka folder proyek di VS Code, lalu jalankan:

```sh
npm ci
npm test
npm link
```

Simpan file pertama sebagai `belajar.lu`. Pilih empat spasi untuk indentasi editor.

## Mencetak teks dan menyimpan nilai

```text
pengaq aran = "Ahmad"
gitaq("Halo " + aran)
pengaq sisi = 5
pengaq luas = sisi * sisi
gitaq(luas)
```

`pengaq` mendeklarasikan variabel; `=` mengubah nilainya setelah deklarasi.
`gitaq` mencetak satu nilai. Output contoh: Halo Ahmad, kemudian 25.
Jalankan `sasak belajar.lu` atau `node src/cli/cli.js belajar.lu`.

## Memilih tindakan

```text
pengaq umur = 18
lamun (umur >= 17):
    gitaq("Dewasa")
deq:
    gitaq("Belum dewasa")
```

Blok setelah titik dua diindentasi empat spasi. `lamun` memilih blok berdasarkan
kondisi boolean. `dan`, `atau`, dan `bukan` menggabungkan atau membalik kondisi:
`gitaq(bukan salaq dan tetu)` mencetak tetu. Null ditulis `deq_araq`.

## Mengulang tindakan

```text
pengaq angka = 1
semasih (angka <= 5):
    gitaq(angka)
    angka = angka + 1
```

Output 1 sampai 5. Jangan lupa memperbarui variabel kondisi agar loop berhenti.
`mengenteng` dapat menghentikan loop, misalnya di dalam kondisi. Lihat pengujian
loop dan `examples/perulangan.lu` untuk contoh yang dapat dijalankan.

## Membuat fungsi

```text
gaweq tambah(a, b):
    sempuleq a + b

gitaq(tambah(5, 3))
```

`gaweq` mendefinisikan fungsi; parameter menerima argumen. `sempuleq` mengembalikan
nilai. Output 8. Fungsi dapat memanggil dirinya sendiri untuk recursion; pastikan
ada kondisi berhenti. Variabel lokal tidak bocor ke luar fungsi.

## Data, OOP, modul, dan async

Jalankan contoh lanjutan berikut:

| Perintah | Yang dipelajari | Output |
| --- | --- | --- |
| `sasak examples/data.lu` | Array/object dan assignment | 10, Ali |
| `sasak examples/oop.lu` | Class, constructor, inheritance, static | Halo Ahmad, Manusia |
| `sasak examples/modul.lu` | Import/export dan try/catch/throw | 8, Contoh error |
| `sasak examples/async.lu` | Async dan await | 8 |

Kode setiap contoh berada di `examples/`. Baca [sintaks](syntax.md) untuk penjelasan
`bale`, `sandiang`, `niki`, `jariang`, `tunang`, `lokaq`, `melengo`, `temang`,
`sugulang`, `cobaq`, `bauang`, `pelewas`, `liwatin`, dan `anti`.

## Membaca error

Error seperti `belajar.lu:3:7 RuntimeError: Variabel x belum dideklarasikan.`
menunjukkan nama file, baris 3, dan kolom 7. Periksa deklarasi variabel, jumlah
argumen, tanda kurung, dan indentasi. String dan angka tidak dikonversi otomatis;
`"umur " + 18` ditolak. Cetak teks dan angka dalam dua panggilan gitaq terpisah.

Nama keyword resmi jangan diubah. Padanan for/continue belum ditentukan.
