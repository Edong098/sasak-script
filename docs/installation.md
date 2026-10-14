# Panduan instalasi Sasak Script

Sasak Script saat ini dipasang dari repository GitHub. Belum tersedia package
publik npm, sehingga jangan menggunakan `npm install -g sasak-script` untuk
memasang proyek ini.

## 1. Siapkan perangkat yang diperlukan

| Kebutuhan | Keterangan |
| --- | --- |
| Node.js 24 LTS | Wajib untuk menjalankan interpreter. npm sudah disertakan pada installer Node.js. |
| Git | Diperlukan untuk clone dan pembaruan repository; dapat diganti Download ZIP jika hanya ingin mencoba. |
| Terminal | PowerShell, Command Prompt, terminal VS Code, atau terminal Linux/macOS. |
| VS Code | Opsional, disarankan untuk menulis program dan membuka terminal dalam folder proyek. |
| Internet | Diperlukan untuk mengunduh tools dan repository, bukan untuk menjalankan contoh lokal. |

Unduh dari situs resmi:

- [Node.js](https://nodejs.org/en/download): pilih Node.js **24 LTS** sesuai sistem operasi.
- [Git](https://git-scm.com/downloads).
- [VS Code](https://code.visualstudio.com/download).

Proyek tidak memerlukan Python, database, API key, file `.env`, akun npm, atau
package tambahan. Akun GitHub tidak diperlukan untuk clone repository publik ini.

### Windows dan VS Code

1. Pasang Node.js dan Git dari installer resmi. Pertahankan pilihan penambahan ke PATH.
2. Pasang VS Code jika ingin menggunakan editor tersebut.
3. Tutup dan buka kembali terminal/VS Code setelah instalasi.
4. Di VS Code, buka **Terminal → New Terminal**.
5. Periksa tools dengan perintah berikut, masing-masing pada baris terpisah:

```sh
node --version
npm --version
git --version
```

Node harus menunjukkan `v24.x.x` atau versi lebih baru yang memenuhi `engines`
proyek; Node.js 24 LTS adalah versi yang direkomendasikan dan diuji dalam CI.
Nomor versi npm mengikuti distribusi Node.js, tidak harus persis sama dengan mesin pengembang.

Jika PowerShell menolak `npm.ps1`, gunakan `npm.cmd` sebagai pengganti `npm`
untuk semua perintah panduan ini, atau pilih terminal **Command Prompt**.
Tidak perlu menonaktifkan kebijakan keamanan PowerShell.

### Linux/macOS

Pasang Node.js 24 LTS melalui installer resmi atau version manager tepercaya,
lalu pasang Git melalui paket sistem atau installer resminya. Periksa versi
menggunakan tiga perintah yang sama di atas.

## 2. Unduh proyek

Pilih folder kerja milik pengguna, misalnya Documents, lalu jalankan:

```sh
git clone https://github.com/Edong098/sasak-script.git
cd sasak-script
```

Jika folder proyek sudah tersedia, masuk ke folder tersebut; tidak perlu clone lagi.
Pada VS Code gunakan **File → Open Folder**, pilih folder `sasak-script`, lalu
buka terminal. Pastikan `package.json` berada di folder kerja terminal.

Alternatif tanpa Git: buka repository GitHub, pilih **Code → Download ZIP**,
ekstrak arsip, lalu buka folder yang berisi `package.json`. Pembaruan untuk cara
ZIP dilakukan dengan mengunduh versi terbaru secara manual.

## 3. Siapkan dan validasi proyek

Dari folder `sasak-script`:

```sh
npm ci
npm test
```

`npm ci` memakai lockfile yang sudah tersedia. Proyek tidak memiliki dependensi
eksternal; instalasi tetap berguna untuk memvalidasi konfigurasi npm/lockfile.
`.npmrc` menonaktifkan lifecycle script instalasi. Perintah `npm test` tetap berjalan
karena merupakan perintah pengujian yang Anda panggil secara eksplisit.

Sesi validasi terakhir menjalankan **144 test**, seluruhnya lulus pada Linux.
Jumlah test dapat berubah ketika proyek dikembangkan. Hasil Windows harus dilihat
pada eksekusi CI Windows; hasil Linux tidak membuktikan native Windows.

## 4. Jalankan tanpa instalasi CLI global

Cara ini tidak memerlukan `npm link`, perubahan PATH, atau hak administrator:

```sh
node src/cli/cli.js --help
node src/cli/cli.js --version
node src/cli/cli.js examples/belajar.lu
```

Output program terakhir:

```text
Halo Ahmad
Sudah dewasa
```

Alternatif melalui npm:

```sh
npm start -- examples/belajar.lu
```

Tanda `--` meneruskan argumen ke CLI Sasak Script.

## 5. Aktifkan perintah `sasak` (opsional)

Jika ingin menjalankan CLI cukup dengan nama `sasak`:

```sh
npm link
sasak --help
sasak --version
sasak examples/untuk.lu
```

Output contoh perulangan adalah `0`, `1`, `3`, `4` pada baris terpisah.
`npm link` membuat hubungan ke checkout lokal; jangan memindahkan atau menghapus
folder tersebut selama link masih digunakan.

Jika muncul error izin ketika melakukan link, gunakan cara langsung pada langkah 4.
Menjalankan interpreter tidak memerlukan hak administrator atau `sudo`.

### Jika perintah sasak tidak ditemukan

Cari prefix npm:

```sh
npm config get prefix
```

- **Windows:** executable/shim npm berada langsung di folder prefix tersebut.
  Tambahkan folder itu ke **Path milik pengguna** melalui pengaturan Environment
  Variables, lalu buka terminal baru. Pada PowerShell gunakan `sasak.cmd` jika
  `sasak.ps1` diblokir kebijakan eksekusi.
- **Linux/macOS:** executable berada di subfolder `bin` dari prefix. Untuk sesi
  terminal saat ini, jalankan `export PATH="$(npm config get prefix)/bin:$PATH"`.
  Penambahan permanen dapat dilakukan pada konfigurasi shell milik pengguna.

Jika tidak ingin mengubah PATH, tetap gunakan `node src/cli/cli.js ...`.

## 6. Buat program sendiri

Di folder proyek, buat file `halo.lu` menggunakan editor:

```text
pengaq aran = "Ahmad"
gitaq("Halo " + aran)

untuk (pengaq i = 0; i < 3; i = i + 1):
    gitaq(i)
```

Simpan sebagai **`halo.lu`**, bukan `halo.lu.txt`. Atur indentasi editor menjadi
empat spasi, tanpa tab. Jalankan:

```sh
node src/cli/cli.js halo.lu
```

Jika CLI sudah di-link, gunakan `sasak halo.lu`. Output: Halo Ahmad, lalu 0, 1, 2
pada baris terpisah. Jika path mengandung spasi, apit path dengan tanda petik:
`sasak "folder program/halo.lu"`.

## 7. Error yang umum

| Pesan/gejala | Perbaikan |
| --- | --- |
| node/npm/git tidak dikenali | Periksa instalasi dan PATH; buka terminal baru. |
| npm tidak menemukan package.json | Masuk ke folder `sasak-script` yang berisi file tersebut. |
| Versi Node tidak sesuai | Gunakan Node.js 24 LTS; cek kembali `node --version`. |
| npm.ps1/sasak.ps1 diblokir | Gunakan npm.cmd/sasak.cmd atau Command Prompt. |
| sasak tidak ditemukan | Jalankan npm link dan periksa prefix/PATH, atau gunakan CLI melalui node. |
| FileError | Periksa nama, ekstensi .lu, path, dan izin baca file. |
| SyntaxError | Periksa tanda kurung, titik dua, keyword, dan indentasi empat spasi. |
| ModuleError di luar folder program | Letakkan modul dalam folder file utama atau subfoldernya. Jangan melemahkan pembatasan impor untuk mengatasi error. |
| LimitError | Periksa loop/recursion tak berujung, ukuran source, output, atau tugas async. Batas default CLI mencakup 100.000 langkah dan 2 detik. |

## 8. Pembaruan dan melepas link

Untuk checkout Git tanpa perubahan lokal yang belum disimpan:

```sh
git pull --ff-only
npm ci
npm test
```

Jika Git menolak karena perubahan lokal, simpan/commit pekerjaan Anda terlebih
dahulu; jangan menggunakan reset atau menghapus file untuk memaksakan pembaruan.

Untuk melepas CLI dari prefix npm yang digunakan saat link:

```sh
npm unlink --global sasak-script
```

Perintah tersebut melepas instalasi/link CLI, bukan menghapus source repository.

## Batas keamanan

Sasak Script membatasi impor, resource eksekusi, dan kontrol terminal. Perlindungan
ini bukan antivirus atau sandbox OS. Jalankan hanya checkout JavaScript yang Anda
percaya; untuk program tak dipercaya gunakan proses/container dengan hak minimal.
Baca [batas eksekusi](syntax.md#batas-eksekusi) dan [tutorial](tutorial.md) sebelum
menulis program yang lebih besar.
