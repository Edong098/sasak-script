# Dasar Sasak Script

## Tujuan pembelajaran

Mencetak pesan, menyimpan nilai, membedakan tipe data, dan menghitung ekspresi.

## Konsep

Variabel menyimpan nilai. Number dipakai untuk hitungan, string untuk teks; boolean adalah tetu/salaq dan null adalah deq_araq. Komentar tidak dieksekusi.

## Sintaks Sasak Script

`pengaq nama = nilai` mendeklarasikan variabel; `nama = nilai` mengubahnya. `gitaq(nilai)` mencetak satu nilai. Operator matematika meliputi `+ - * / %`. `+` hanya menerima dua angka atau dua string, bukan campuran.

## Contoh yang dapat dijalankan

File: [`examples/01-dasar/08-luas-persegi.lu`](../examples/01-dasar/08-luas-persegi.lu).

```text
# Menghitung luas persegi dari panjang sisi.
pengaq sisi = 5
pengaq luas = sisi * sisi
gitaq("Luas persegi:")
gitaq(luas)
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/01-dasar/08-luas-persegi.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/01-dasar/08-luas-persegi.lu`.

## Output

```text
Luas persegi:
25
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-hello-world.lu](../examples/01-dasar/01-hello-world.lu) | Mencetak salam ke terminal. |
| [02-variabel.lu](../examples/01-dasar/02-variabel.lu) | Mendeklarasikan dan mengubah nilai variabel. |
| [03-tipe-data.lu](../examples/01-dasar/03-tipe-data.lu) | Mengenali number, string, boolean, dan null. |
| [04-operator-aritmatika.lu](../examples/01-dasar/04-operator-aritmatika.lu) | Menghitung dengan tambah, kurang, kali, bagi, modulo, dan unary. |
| [05-operator-perbandingan.lu](../examples/01-dasar/05-operator-perbandingan.lu) | Membandingkan dua angka tanpa konversi tipe. |
| [06-operator-logika.lu](../examples/01-dasar/06-operator-logika.lu) | Menggunakan dan, atau, dan bukan pada boolean. |
| [07-komentar.lu](../examples/01-dasar/07-komentar.lu) | Menulis komentar tanpa mengubah output program. |
| [08-luas-persegi.lu](../examples/01-dasar/08-luas-persegi.lu) | Menghitung luas persegi dari panjang sisi. |
| [09-luas-persegi-panjang.lu](../examples/01-dasar/09-luas-persegi-panjang.lu) | Menghitung luas persegi panjang. |
| [10-konversi-suhu.lu](../examples/01-dasar/10-konversi-suhu.lu) | Mengubah suhu Celsius menjadi Fahrenheit. |

## Latihan

1. Ubah sisi dari 5 menjadi 7. Prediksi luas 49 sebelum menjalankan program.
2. Ubah suhu contoh konversi menjadi 0 Celsius; periksa hasil 32 Fahrenheit.
3. Coba `gitaq("umur " + 18)` lalu pahami error tipe; cetak teks dan angka pada dua baris.

## Catatan dan batasan

Gunakan nama variabel ASCII. Pilih empat spasi pada editor; jangan menyalin tanda pagar Markdown sebagai bagian source kecuali memang komentar.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
