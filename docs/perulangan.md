# Perulangan

## Tujuan pembelajaran

Mengulang pekerjaan, menghentikan loop, dan melewati satu iterasi dengan aman.

## Konsep

While memeriksa kondisi sebelum setiap iterasi. For menempatkan deklarasi awal, kondisi, dan pembaruan dalam satu header. Nested loop menjalankan loop di dalam loop.

## Sintaks Sasak Script

`semasih (kondisi):` membutuhkan pembaruan variabel agar berhenti. `untuk (pengaq i = 0; i < batas; i = i + 1):` memisahkan tiga bagian wajib dengan titik koma. `mengenteng` keluar dari loop terdekat; `lanjutkan` melewati sisa body. Pada untuk, pembaruan tetap berjalan setelah lanjutkan.

## Contoh yang dapat dijalankan

File: [`examples/03-perulangan/11-continue.lu`](../examples/03-perulangan/11-continue.lu).

```text
# Melewati angka 3 dengan lanjutkan tanpa menghentikan loop.
untuk (pengaq angka = 1; angka <= 5; angka = angka + 1):
    lamun (angka == 3):
        lanjutkan
    gitaq(angka)
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/03-perulangan/11-continue.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/03-perulangan/11-continue.lu`.

## Output

```text
1
2
4
5
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-while.lu](../examples/03-perulangan/01-while.lu) | Mengulang pencetakan angka selama kondisi benar. |
| [02-break.lu](../examples/03-perulangan/02-break.lu) | Menghentikan loop saat target ditemukan. |
| [03-nested-loop.lu](../examples/03-perulangan/03-nested-loop.lu) | Membuat pasangan angka melalui dua loop. |
| [04-bilangan-1-100.lu](../examples/03-perulangan/04-bilangan-1-100.lu) | Mencetak bilangan 1 sampai 100. |
| [05-bilangan-genap.lu](../examples/03-perulangan/05-bilangan-genap.lu) | Mencetak bilangan genap dari 2 sampai 10. |
| [06-tabel-perkalian.lu](../examples/03-perulangan/06-tabel-perkalian.lu) | Mencetak hasil perkalian 3 dengan 1 sampai 5. |
| [07-faktorial.lu](../examples/03-perulangan/07-faktorial.lu) | Menghitung faktorial dengan akumulator loop. |
| [08-deret-fibonacci.lu](../examples/03-perulangan/08-deret-fibonacci.lu) | Membangun delapan bilangan Fibonacci secara iteratif. |
| [09-pola-bintang.lu](../examples/03-perulangan/09-pola-bintang.lu) | Membentuk segitiga bintang dengan nested loop. |
| [10-for.lu](../examples/03-perulangan/10-for.lu) | Menggunakan header untuk: nilai awal, kondisi, dan pembaruan. |
| [11-continue.lu](../examples/03-perulangan/11-continue.lu) | Melewati angka 3 dengan lanjutkan tanpa menghentikan loop. |

## Latihan

1. Ubah angka yang dilewati dari 3 menjadi 4.
2. Ubah batas pola bintang dari 4 menjadi 6.
3. Tambahkan lanjutkan pada while; pastikan penghitung diperbarui sebelum lanjutkan agar tidak menjadi loop tak berujung.

## Catatan dan batasan

Variabel penghitung untuk hanya hidup dalam scope loop. Program tetap tunduk pada batas 100.000 langkah dan 2 detik; batas tidak perlu dinaikkan untuk contoh-contoh ini.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
