# Mini project

## Tujuan pembelajaran

Menggabungkan variabel, fungsi, loop, data, kondisi, dan class dalam program kecil.

## Konsep

Mini project memisahkan data masukan, proses, dan keluaran. Data saat ini disimpan di source agar contoh deterministik dan tidak memerlukan fitur yang belum tersedia.

## Sintaks Sasak Script

Gunakan keyword yang sudah dipelajari. Kalkulator memiliki validasi pembagian nol; nilai siswa memakai bobot tugas 20%, UTS 30%, UAS 50%; kasir menghitung diskon 10% untuk total minimal 30.000; manajemen mahasiswa memakai array instance.

## Contoh yang dapat dijalankan

File: [`examples/08-mini-project/05-tebak-angka.lu`](../examples/08-mini-project/05-tebak-angka.lu).

```text
# Simulasi tebak angka dengan target dan tebakan tetap, tanpa input/random.
gitaq("Simulasi: target dan tebakan sudah ditentukan.")
pengaq target = 7
pengaq tebakan = [3, 9, 7]
pengaq jumlah = 3
pengaq menang = salaq
untuk (pengaq i = 0; i < jumlah; i = i + 1):
    gitaq("Tebakan:")
    gitaq(tebakan[i])
    lamun (tebakan[i] == target):
        gitaq("Benar!")
        menang = tetu
        mengenteng
    lamun (tebakan[i] < target):
        gitaq("Terlalu kecil")
    deq:
        gitaq("Terlalu besar")
lamun (bukan menang):
    gitaq("Belum berhasil")
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/08-mini-project/05-tebak-angka.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/08-mini-project/05-tebak-angka.lu`.

## Output

```text
Simulasi: target dan tebakan sudah ditentukan.
Tebakan:
3
Terlalu kecil
Tebakan:
9
Terlalu besar
Tebakan:
7
Benar!
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-kalkulator.lu](../examples/08-mini-project/01-kalkulator.lu) | Kalkulator empat operasi dengan validasi pembagian nol. |
| [02-sistem-nilai-siswa.lu](../examples/08-mini-project/02-sistem-nilai-siswa.lu) | Menghitung nilai berbobot dan kelulusan tiga siswa. |
| [03-kasir-sederhana.lu](../examples/08-mini-project/03-kasir-sederhana.lu) | Menghitung total belanja, diskon, pembayaran, dan kembalian. |
| [04-manajemen-mahasiswa.lu](../examples/08-mini-project/04-manajemen-mahasiswa.lu) | Membuat, memperbarui, dan membaca data mahasiswa di memori. |
| [05-tebak-angka.lu](../examples/08-mini-project/05-tebak-angka.lu) | Simulasi tebak angka dengan target dan tebakan tetap, tanpa input/random. |
| [06-konversi-suhu.lu](../examples/08-mini-project/06-konversi-suhu.lu) | Mengonversi suhu dengan tiga fungsi dan data tetap. |
| [07-statistik-nilai.lu](../examples/08-mini-project/07-statistik-nilai.lu) | Merangkum nilai ke object statistik lalu menampilkan hasil. |
| [08-permainan-kuis.lu](../examples/08-mini-project/08-permainan-kuis.lu) | Simulasi kuis dengan jawaban tersimpan, tanpa input interaktif. |

## Latihan

1. Ubah daftar tebakan menjadi [1, 2, 3] dan periksa pesan Belum berhasil.
2. Pada kasir, ubah harga, jumlah barang, dan pembayaran; hitung kembalian secara manual.
3. Ubah jawaban kuis tersimpan, lalu cocokkan skor. Ini tetap simulasi, bukan input pengguna.
4. Pada statistik, coba dataset lain yang tidak kosong dan sesuaikan jumlah datanya.

## Catatan dan batasan

Tebak angka memakai target tetap 7 dan array tebakan [3, 9, 7]. Kuis memakai jawaban tersimpan. Tidak ada input interaktif, random, database, atau penyimpanan file. Array mahasiswa tetap; contoh menyediakan pembuatan, pembaruan nilai, dan pembacaan, bukan CRUD persisten.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
