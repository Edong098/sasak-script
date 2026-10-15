# Percabangan

## Tujuan pembelajaran

Memilih tindakan berdasarkan perbandingan, boolean, dan kondisi bersarang.

## Konsep

Kondisi mengarahkan alur program. Modulo menghitung sisa pembagian; angka genap bersisa nol ketika dibagi dua.

## Sintaks Sasak Script

`lamun (kondisi):` menjalankan blok ketika kondisi tetu. `deq:` adalah alternatif ketika salaq. Blok diindentasi empat spasi; kondisi harus boolean. Gunakan nested lamun untuk lebih dari dua pilihan, bukan sintaks else-if dari bahasa lain.

## Contoh yang dapat dijalankan

File: [`examples/02-percabangan/04-ganjil-genap.lu`](../examples/02-percabangan/04-ganjil-genap.lu).

```text
# Menentukan paritas dengan sisa pembagian.
pengaq angka = 7
lamun (angka % 2 == 0):
    gitaq("Genap")
deq:
    gitaq("Ganjil")
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/02-percabangan/04-ganjil-genap.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/02-percabangan/04-ganjil-genap.lu`.

## Output

```text
Ganjil
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-if.lu](../examples/02-percabangan/01-if.lu) | Menjalankan blok hanya ketika kondisi benar. |
| [02-if-else.lu](../examples/02-percabangan/02-if-else.lu) | Memilih salah satu dari dua hasil. |
| [03-nested-if.lu](../examples/02-percabangan/03-nested-if.lu) | Memeriksa kondisi di dalam kondisi lain. |
| [04-ganjil-genap.lu](../examples/02-percabangan/04-ganjil-genap.lu) | Menentukan paritas dengan sisa pembagian. |
| [05-nilai-kelulusan.lu](../examples/02-percabangan/05-nilai-kelulusan.lu) | Membandingkan nilai dengan batas kelulusan. |
| [06-kategori-umur.lu](../examples/02-percabangan/06-kategori-umur.lu) | Mengelompokkan umur dengan nested if. |
| [07-bilangan-terbesar.lu](../examples/02-percabangan/07-bilangan-terbesar.lu) | Memilih nilai terbesar dari tiga bilangan. |
| [08-diskon-belanja.lu](../examples/02-percabangan/08-diskon-belanja.lu) | Memberikan diskon ketika total melewati batas. |

## Latihan

1. Ubah angka 7 menjadi 8 dan periksa output Genap.
2. Pada contoh kelulusan, coba nilai 74, 75, dan 76 untuk memeriksa batas.
3. Pada contoh bilangan terbesar, coba dua nilai sama dan bilangan negatif.

## Catatan dan batasan

Assignment ke variabel luar berlaku di scope lexical terdekat. Variabel yang dideklarasikan di dalam blok tidak dapat dibaca di luar blok.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
