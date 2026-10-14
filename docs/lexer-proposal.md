# Aturan lexer TASK 02

Aturan berikut digunakan setelah instruksi pengguna untuk melanjutkan TASK 02–12.

1. Indentasi: empat spasi per tingkat; tab ditolak; dedent harus kembali ke tingkat sebelumnya. Baris kosong dan komentar saja tidak mengubah indentasi.
2. String: petik tunggal atau ganda, satu baris; escape yang didukung `\\`, `\"`, `\'`, `\n`, `\r`, dan `\t`; escape lainnya menimbulkan error.
3. Angka: bilangan desimal seperti `12` dan `12.5`; tanda minus adalah operator terpisah. Notasi eksponen, heksadesimal, dan pemisah underscore belum didukung.
4. Identifier: huruf ASCII atau underscore di awal, lalu huruf ASCII, angka, atau underscore; case-sensitive. Kata kunci resmi dicadangkan.
5. Baris: LF dan CRLF diterima. NEWLINE menandai akhir statement; ekspresi lintas baris belum didukung. DEDENT ditutup sebelum EOF meskipun file tidak diakhiri newline.

Lexer menghasilkan token dengan baris, kolom, dan nama file; semua posisi dimulai dari 1.
