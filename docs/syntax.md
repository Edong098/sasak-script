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

TASK 05: `lamun (kondisi):` / `deq:` tersedia dengan blok empat spasi.
Blok memiliki scope lokal. Kondisi hanya menerima boolean. `dan` dan `atau`
melakukan short circuit; prioritas dari rendah: atau, dan, equality, comparison,
penjumlahan, perkalian, unary. Literal: `tetu`, `salaq`, `deq_araq`.
`==` dan `!=` tidak melakukan konversi tipe.

TASK 06: `semasih (kondisi):` mengevaluasi ulang kondisi pada setiap iterasi.
`mengenteng` hanya legal di dalam loop dan keluar dari loop terdekat.
Setiap iterasi memiliki scope blok baru. Belum ada keyword for atau continue.

TASK 07: `gaweq nama(parameter):` membuat fungsi dengan lexical closure;
jumlah argumen harus tepat. `sempuleq nilai` mengakhiri fungsi; return kosong
atau mencapai akhir fungsi menghasilkan `deq_araq`. Return di luar fungsi
serta break yang melintasi batas fungsi ditolak parser. Recursion didukung.

TASK 08: array `[10, 20]` dan object `{"aran": "Ahmad"}` dapat dibaca dan
 dimodifikasi lewat index/property. Key object adalah string; index array harus
integer 0 sampai panjang-1. Assignment object dapat membuat property baru;
assignment array hanya mengganti elemen yang sudah ada. Akses property hilang
menimbulkan error. Struktur data memiliki semantik referensi; equality membandingkan
identitas, bukan isi. Tidak mengekspos prototype atau API object JavaScript.

TASK 09: `bale Anak tunang Induk:` mendefinisikan inheritance. Constructor:
`sandiang(parameter):`; instance: `jariang Nama(argumen)`. Method:
`gaweq nama():`; static: `melengo gaweq nama():`. `niki` adalah receiver bound,
termasuk ketika method disimpan dalam variabel. `lokaq(argumen)` memanggil
constructor induk, dan `lokaq.nama()` memanggil method induk. Class tanpa
constructor memakai constructor terdekat dari induknya, atau constructor nol
argumen. Nilai return constructor diabaikan. Field instance terpisah dari method;
field dengan nama sama menutupi method pada instance itu. Static method diwariskan.

TASK 10: `temang "./modul.lu"` memasukkan semua nama ekspor ke scope modul
pemanggil. `sugulang pengaq`, `sugulang gaweq`, dan `sugulang bale` mengekspor
deklarasi. Import/export hanya di tingkat modul; konflik nama ditolak. Path
relatif terhadap file pengimpor, bukan working directory; hanya `.lu`, tanpa
package atau JavaScript host. Cache per eksekusi memakai path canonical; siklus
ditolak. Ekspor merupakan snapshot nilai saat deklarasi (referensi object tetap
sama), bukan live binding. Scope internal modul tidak bocor ke pengimpor.

`cobaq:` / `bauang error:` menangkap `pelewas nilai` dan runtime error. Nilai
throw diterima apa adanya; runtime error menjadi string yang memuat lokasi.
Return/break tidak ditangkap. Syntax error di file utama terjadi sebelum eksekusi,
sehingga tidak bisa ditangkap oleh program yang sama.
