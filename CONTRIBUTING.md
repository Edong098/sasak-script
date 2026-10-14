# Berkontribusi

Kontribusi penutur Lotura, pendidik, pemula, dan pengembang diterima.

1. Diskusikan perubahan bahasa melalui issue sebelum mengubah spesifikasi.
2. Fork repository dan buat branch untuk satu perubahan.
3. Gunakan Node.js 24 LTS; jalankan `npm ci` dan `npm test`.
4. Tambahkan pengujian node:test, contoh `.lu`, dan dokumentasi bahasa Indonesia.
5. Ajukan pull request yang menjelaskan masalah, perubahan, dan hasil test.

Jangan mengubah keyword resmi tanpa persetujuan pemilik. Padanan for/continue
adalah `untuk`/`lanjutkan`. Implementasi harus tetap Lexer → Parser → AST → Interpreter, tanpa eval,
Function constructor, atau penggantian teks menjadi JavaScript. Pisahkan parsing,
runtime, dan CLI. Pertahankan lokasi source untuk diagnostik.

Uji perilaku normal, error, scope, dan integrasi CLI. Test harus portable menggunakan
node:path, temporary directory, process.execPath, dan pemanggilan proses tanpa shell.
CI memakai Ubuntu dan Windows; pengujian Linux tidak membuktikan native Windows.

Untuk CLI lokal: `npm link`, lalu `sasak examples/belajar.lu`. Hapus link melalui
`npm unlink --global sasak-script` bila tidak dibutuhkan. Jangan publish npm atau
membuat release publik tanpa persetujuan pemilik proyek.
