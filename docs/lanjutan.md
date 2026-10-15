# Modul, error handling, dan async

## Tujuan pembelajaran

Memisahkan fungsi ke modul, menangani kesalahan, dan menunggu hasil async.

## Konsep

Modul memberi scope dan ekspor yang jelas. Try/catch menangani error yang dapat dipulihkan. Fungsi async menghasilkan promise runtime, yang dibuka dengan await bahasa.

## Sintaks Sasak Script

`sugulang gaweq ...` mengekspor fungsi dan `temang "./modules/matematika.lu"` mengimpornya. `cobaq:` / `bauang error:` menangkap `pelewas nilai` atau runtime error. `liwatin gaweq ...` membuat fungsi async; `anti tugas` hanya legal di dalam fungsi async.

## Contoh yang dapat dijalankan

File: [`examples/07-lanjutan/03-import-export.lu`](../examples/07-lanjutan/03-import-export.lu).

```text
# Mengimpor fungsi yang diekspor modul lokal.
# Modul berada di subfolder ini agar tetap di dalam root impor program.
temang "./modules/matematika.lu"
gitaq(tambah(5, 3))
gitaq(kali(4, 6))
```

Modul pendukung [`modules/matematika.lu`](../examples/07-lanjutan/modules/matematika.lu):

```text
# Modul pendukung: menyediakan operasi matematika tanpa output.
sugulang gaweq tambah(a, b):
    sempuleq a + b
sugulang gaweq kali(a, b):
    sempuleq a * b
sugulang gaweq luasPersegi(sisi):
    sempuleq sisi * sisi
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/07-lanjutan/03-import-export.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/07-lanjutan/03-import-export.lu`.

## Output

```text
8
24
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-try-catch.lu](../examples/07-lanjutan/01-try-catch.lu) | Menangkap runtime error agar program dapat melanjutkan. |
| [02-throw.lu](../examples/07-lanjutan/02-throw.lu) | Melempar dan menangkap pesan validasi buatan sendiri. |
| [03-import-export.lu](../examples/07-lanjutan/03-import-export.lu) | Mengimpor fungsi yang diekspor modul lokal. |
| [04-async.lu](../examples/07-lanjutan/04-async.lu) | Memulai fungsi async; CLI menunggu tugas selesai. |
| [05-await.lu](../examples/07-lanjutan/05-await.lu) | Membuka hasil fungsi async dengan anti. |
| [06-modul-matematika.lu](../examples/07-lanjutan/06-modul-matematika.lu) | Menggabungkan beberapa fungsi modul matematika. |
| [modules/matematika.lu](../examples/07-lanjutan/modules/matematika.lu) | Modul pendukung: menyediakan operasi matematika tanpa output. |

## Latihan

1. Tambahkan fungsi kurang ke modul lalu panggil dari file pengimpor.
2. Coba validasiNilai(80) dan validasiNilai(120), lalu bandingkan jalurnya.
3. Pada contoh await, ubah parameter tambah(5, 3) menjadi tambah(10, 2).

## Catatan dan batasan

Modul harus berada di folder file utama atau subfoldernya; impor keluar root dan siklus ditolak. Modul pustaka tidak mencetak output jika dijalankan sendiri. Async di sini tidak memakai jaringan/timer. LimitError bersifat fatal dan tidak ditangkap cobaq.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
