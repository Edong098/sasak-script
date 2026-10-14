# Sintaks awal

Dokumen ini menjelaskan rancangan bahasa, bukan fitur interpreter yang sudah berjalan.

- File menggunakan ekstensi `.lu`.
- Pemanggilan fungsi menggunakan tanda kurung: `gitaq("Halo")`.
- Blok menggunakan titik dua dan indentasi; detail validasi indentasi akan ditentukan saat lexer dibangun.
- Titik koma tidak diwajibkan.
- Komentar satu baris diawali `#`.
- Deklarasi: `pengaq angka = 1`; perubahan nilai: `angka = angka + 1`.
- Ekspresi matematika dan logika akan didukung secara bertahap.
- Error bahasa nantinya menyertakan baris dan kolom.

## Contoh rancangan

```text
pengaq aran = "Ahmad"
pengaq umur = 22
gitaq("Halo " + aran)

lamun (umur >= 17):
    gitaq("Dewasa")
deq:
    gitaq("Belum dewasa")

pengaq angka = 1
semasih (angka <= 5):
    gitaq(angka)
    angka = angka + 1

gaweq tambah(a, b):
    sempuleq a + b

gitaq(tambah(5, 3))
```

Semua contoh di atas belum dapat dieksekusi. Kondisi dan perulangan ditargetkan
untuk v0.2; fungsi untuk v0.3. Semantik operator, scope, dan tipe akan dirinci pada task berikutnya.

TASK 04: deklarasi, assignment, `gitaq`, number, string, unary `+`/`-`, dan
operator `+ - * / %` sudah tersedia. `+` menggabungkan dua string atau menjumlahkan
dua angka; tidak ada konversi tipe otomatis. Pembagian nol menghasilkan error.
Jalankan `sasak examples/persegi.lu` untuk mencetak luas 25.
