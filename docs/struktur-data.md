# Array, object, dan algoritma data

## Tujuan pembelajaran

Membaca/mengubah data, mencari nilai, mengurutkan, serta menghitung statistik.

## Konsep

Array menyimpan data berurutan dengan index mulai nol. Object menyimpan pasangan key string dan nilai. Sorting membandingkan serta menukar elemen; statistik memakai akumulator dan pembandingan.

## Sintaks Sasak Script

`pengaq data = [5, 1, 4, 2, 8]` membuat array; `data[0]` membacanya dan `data[0] = 9` mengganti elemen. Object ditulis `{"nama": "Ahmad"}`, dibaca dengan `.nama` atau `["nama"]`. Nested array memakai dua index. Index di luar batas menghasilkan error.

## Contoh yang dapat dijalankan

File: [`examples/05-struktur-data/07-bubble-sort.lu`](../examples/05-struktur-data/07-bubble-sort.lu).

```text
# Mengurutkan angka dengan membandingkan pasangan bersebelahan.
pengaq data = [5, 1, 4, 2, 8]
# Sesuaikan jumlah jika elemen data diubah; belum ada builtin panjang array.
pengaq jumlah = 5
untuk (pengaq putaran = 0; putaran < jumlah - 1; putaran = putaran + 1):
    untuk (pengaq i = 0; i < jumlah - 1 - putaran; i = i + 1):
        lamun (data[i] > data[i + 1]):
            pengaq sementara = data[i]
            data[i] = data[i + 1]
            data[i + 1] = sementara
untuk (pengaq i = 0; i < jumlah; i = i + 1):
    gitaq(data[i])
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/05-struktur-data/07-bubble-sort.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/05-struktur-data/07-bubble-sort.lu`.

## Output

```text
1
2
4
5
8
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-array.lu](../examples/05-struktur-data/01-array.lu) | Menyimpan tiga nama dalam array. |
| [02-index-array.lu](../examples/05-struktur-data/02-index-array.lu) | Membaca elemen array dengan index mulai dari nol. |
| [03-update-array.lu](../examples/05-struktur-data/03-update-array.lu) | Mengganti elemen yang sudah ada pada array. |
| [04-object.lu](../examples/05-struktur-data/04-object.lu) | Menyimpan dan memperbarui property object. |
| [05-nested-array.lu](../examples/05-struktur-data/05-nested-array.lu) | Membaca matriks melalui dua index. |
| [06-pencarian-linear.lu](../examples/05-struktur-data/06-pencarian-linear.lu) | Mencari nilai dengan memeriksa elemen satu per satu. |
| [07-bubble-sort.lu](../examples/05-struktur-data/07-bubble-sort.lu) | Mengurutkan angka dengan membandingkan pasangan bersebelahan. |
| [08-selection-sort.lu](../examples/05-struktur-data/08-selection-sort.lu) | Mengurutkan dengan memilih nilai minimum tiap putaran. |
| [09-statistik-sederhana.lu](../examples/05-struktur-data/09-statistik-sederhana.lu) | Menghitung jumlah, rata-rata, minimum, dan maksimum. |

## Latihan

1. Uji bubble sort dan selection sort pada angka duplikat dan bilangan negatif.
2. Ubah target pencarian menjadi nilai yang tidak ada; periksa pesan Tidak ditemukan.
3. Ubah dataset statistik lalu hitung total/minimum/maksimum secara manual untuk memeriksa hasil.

## Catatan dan batasan

Belum ada builtin panjang array atau append. Jumlah ditulis eksplisit dan harus ikut diperbarui jika array berubah. Statistik mensyaratkan data tidak kosong. Cetak elemen/property satu per satu; jangan mengandalkan format cetak object host.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
