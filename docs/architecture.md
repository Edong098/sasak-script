# Arsitektur

Alur yang direncanakan:

```text
Source Code (.lu) → Lexer → Tokens → Parser → AST → Interpreter → Output
```

Interpreter akan memproses AST secara langsung, tanpa `eval()` atau `new Function()`
dan tanpa mengganti kata kunci menjadi JavaScript.

## Tanggung jawab file

| File | Tanggung jawab |
| --- | --- |
| `src/index.js` | Metadata proyek; kelak titik masuk API |
| `src/cli/cli.js` | CLI bantuan dan versi; kelak menjalankan file `.lu` |
| `src/lexer/lexer.js` | Kelak membaca source menjadi token |
| `src/lexer/tokens.js` | Kelak mendefinisikan jenis token dan kata kunci |
| `src/parser/parser.js` | Kelak mengubah token menjadi AST |
| `src/ast/nodes.js` | Kelak mendefinisikan node AST |
| `src/runtime/interpreter.js` | Kelak mengevaluasi AST |
| `src/runtime/environment.js` | Kelak menyimpan variabel dan scope |
| `src/errors/SasakError.js` | Kelak menyediakan error bahasa dengan lokasi source |
| `tests/cli.test.js` | Menguji perilaku CLI melalui proses Node.js |
| `examples/hello.lu` | Ilustrasi program pertama; belum executable |

Modul interpreter saat ini hanya penanda struktur, tanpa implementasi.
Tidak ada dependensi eksternal, tahap build, atau layanan tambahan pada TASK 01.
