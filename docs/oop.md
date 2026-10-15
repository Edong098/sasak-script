# Pemrograman berorientasi object

## Tujuan pembelajaran

Mengelompokkan data/perilaku ke class, membuat instance, dan memakai inheritance.

## Konsep

Class adalah cetak biru, instance adalah object yang dibuat dari class. Constructor mengisi data awal, method bekerja pada instance, inheritance memakai kembali perilaku induk, dan static method dipanggil melalui class.

## Sintaks Sasak Script

`bale Nama:` mendefinisikan class; `sandiang(...)` adalah constructor, `niki` receiver, `jariang Nama(...)` membuat instance. `tunang` menentukan induk. `lokaq(...)` memanggil constructor induk dan `lokaq.nama()` memanggil method induk. Static method ditulis `melengo gaweq nama():`.

## Contoh yang dapat dijalankan

File: [`examples/06-oop/06-super.lu`](../examples/06-oop/06-super.lu).

```text
# Memanggil constructor dan method induk melalui lokaq.
bale Manusia:
    sandiang(nama):
        niki.nama = nama
    gaweq salam():
        sempuleq "Halo " + niki.nama
bale Pelajar tunang Manusia:
    sandiang(nama, sekolah):
        lokaq(nama)
        niki.sekolah = sekolah
    gaweq salam():
        sempuleq lokaq.salam() + " dari " + niki.sekolah
pengaq pelajar = jariang Pelajar("Ahmad", "SMA Lombok Utara")
gitaq(pelajar.salam())
```

## Cara menjalankan

Dari folder repository, gunakan Node.js 24 LTS:

```sh
node src/cli/cli.js examples/06-oop/06-super.lu
```

Jika CLI sudah di-link, perintah yang sama adalah `sasak examples/06-oop/06-super.lu`.

## Output

```text
Halo Ahmad dari SMA Lombok Utara
```

## Contoh lain dalam kategori

| File | Konsep |
| --- | --- |
| [01-class.lu](../examples/06-oop/01-class.lu) | Mendefinisikan class sebagai cetak biru object. |
| [02-object.lu](../examples/06-oop/02-object.lu) | Membuat dua instance dengan data yang terpisah. |
| [03-constructor.lu](../examples/06-oop/03-constructor.lu) | Mengisi property saat instance dibuat. |
| [04-method.lu](../examples/06-oop/04-method.lu) | Mengubah state object melalui method. |
| [05-inheritance.lu](../examples/06-oop/05-inheritance.lu) | Mewarisi constructor dan method dari class induk. |
| [06-super.lu](../examples/06-oop/06-super.lu) | Memanggil constructor dan method induk melalui lokaq. |
| [07-static.lu](../examples/06-oop/07-static.lu) | Memanggil method class tanpa membuat instance. |
| [08-data-mahasiswa.lu](../examples/06-oop/08-data-mahasiswa.lu) | Menyimpan data dan menentukan status mahasiswa lewat class. |

## Latihan

1. Tambahkan property kelas dan method tampilkanKelas pada contoh Pelajar.
2. Buat dua instance dengan nama berbeda dan periksa bahwa datanya terpisah.
3. Pada contoh static, tambahkan method kelilingPersegi(sisi) yang menghasilkan sisi * 4.

## Catatan dan batasan

Belum ada multiple inheritance. Manajemen data contoh berjalan di memori, tanpa database. Constructor bukan fungsi async.

Jalankan `npm run examples:test` untuk memeriksa seluruh contoh, atau `npm test`
untuk seluruh pengujian. Urutan belajar dan keluaran lengkap tersedia di
[katalog examples](../examples/README.md) dan [expected-output.json](../examples/expected-output.json).
