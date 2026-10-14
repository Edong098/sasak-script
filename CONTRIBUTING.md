# Berkontribusi

Kontribusi penutur Lotura, pendidik, pemula, dan pengembang diterima.
Jika menemukan bug, kesalahan dokumentasi, atau kode yang perlu dirapikan,
langsung kerjakan perbaikannya. Tidak perlu melapor atau meminta persetujuan
pemilik terlebih dahulu. Issue dapat digunakan untuk diskusi atau mencatat
masalah yang belum dapat diselesaikan, tetapi bukan syarat untuk mulai memperbaiki.

1. Periksa masalah dan perilaku yang diharapkan, lalu fork repository dan buat branch.
2. Gunakan Node.js 24 LTS; jalankan `npm ci` dan `npm test`.
3. Buat perbaikan yang terfokus. Untuk bug kode, tambahkan test regresi yang membuktikan masalahnya teratasi.
4. Perbarui contoh `.lu` dan dokumentasi bahasa Indonesia bila perilaku berubah.
5. Ajukan pull request yang menjelaskan masalah, perbaikan, dan hasil pengujian.

Gunakan [keyword resmi](docs/keywords.md), termasuk `untuk` untuk for dan
`lanjutkan` untuk continue. Perbaikan bug mengikuti sintaks yang terdokumentasi.
Jika perubahan memengaruhi spesifikasi atau kompatibilitas, jelaskan dampaknya
beserta contoh pada pull request agar dapat ditinjau bersama.

Implementasi tetap mengikuti Lexer → Parser → AST → Interpreter, tanpa `eval()`,
`new Function()`, atau penggantian teks menjadi JavaScript. Pisahkan parsing,
runtime, dan CLI. Pertahankan lokasi source untuk diagnostik.

Uji perilaku normal, error, scope, dan integrasi CLI. Test harus portable menggunakan
`node:path`, temporary directory, `process.execPath`, dan pemanggilan proses tanpa shell.
CI memakai Ubuntu dan Windows; laporkan hasil pengujian sesuai platform yang benar-benar dijalankan.

Untuk CLI lokal: `npm link`, lalu `sasak examples/belajar.lu`. Hapus link melalui
`npm unlink --global sasak-script` bila tidak dibutuhkan. Publikasi npm dan release
publik tetap memerlukan persetujuan pemilik proyek.
