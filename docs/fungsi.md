# Fungsi dan scope

## Tujuan pembelajaran

Memecah program menjadi fungsi, mengirim parameter, memakai return, dan memahami recursion.

## Konsep

Parameter adalah nama masukan fungsi. Return mengirim hasil kepada pemanggil. Scope lokal mencegah variabel fungsi bocor; lexical closure mengacu pada lingkungan tempat fungsi didefinisikan.

## Sintaks Sasak Script

`gaweq nama(a, b):` mendefinisikan fungsi. Panggil dengan `nama(5, 3)`. `sempuleq nilai` menghentikan fungsi dan mengembalikan nilai; tanpa return hasilnya deq_araq. Jumlah argumen harus tepat. Fungsi rekursif wajib memiliki kondisi berhenti.

## Contoh yang dapat dijalankan

File: [`examples/04-fungsi/03-return.lu`](../examples/04-fungsi/03-return.lu).

```text
# Menggunakan hasil fungsi pada ekspresi berikutnya.
gaweq tambah(a, b):
    sempuleq a + b
pengaq hasil = tambah(5, 3)
gitaq(hasil)
gitaq(hasil * 2)
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/04-fungsi/03-return.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/04-fungsi/03-return.lu`.

## Output

```text
8
16
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-fungsi-dasar.lu](../examples/04-fungsi/01-fungsi-dasar.lu) | Mendefinisikan dan memanggil fungsi tanpa parameter. |
| [02-parameter.lu](../examples/04-fungsi/02-parameter.lu) | Mengirim nama sebagai parameter fungsi. |
| [03-return.lu](../examples/04-fungsi/03-return.lu) | Menggunakan hasil fungsi pada ekspresi berikutnya. |
| [04-scope.lu](../examples/04-fungsi/04-scope.lu) | Membedakan variabel global dan variabel lokal. |
| [05-rekursi.lu](../examples/04-fungsi/05-rekursi.lu) | Memanggil fungsi sendiri dengan kondisi berhenti. |
| [06-faktorial-rekursif.lu](../examples/04-fungsi/06-faktorial-rekursif.lu) | Menghitung faktorial secara rekursif. |
| [07-fibonacci-rekursif.lu](../examples/04-fungsi/07-fibonacci-rekursif.lu) | Menghitung Fibonacci kecil dengan dua panggilan rekursif. |
| [08-kalkulator-fungsi.lu](../examples/04-fungsi/08-kalkulator-fungsi.lu) | Memisahkan empat operasi kalkulator ke fungsi. |

## Latihan

1. Tambahkan fungsi kuadrat dan uji kuadrat(6) menghasilkan 36.
2. Bandingkan output contoh scope sebelum dan sesudah mengganti nama variabel lokal.
3. Uji faktorial(0), faktorial(1), dan faktorial(5). Jangan memasukkan angka negatif tanpa menambah validasi.

## Catatan dan batasan

Fibonacci rekursif memakai input 8 agar tetap kecil. Jumlah panggilannya tumbuh cepat; contoh iteratif lebih cocok untuk deret panjang.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
