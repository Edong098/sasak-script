import { open, lstat } from "node:fs/promises";
import { constants } from "node:fs";
import { SasakError } from "../errors/SasakError.js";

/** Baca terbatas, hanya file biasa; hindari alokasi menurut ukuran file penyerang. */
export async function readSource(file, budget, location = { file }) {
  let handle;
  try {
    budget.check(location);
    if (!(await lstat(file)).isFile())
      throw new SasakError(
        "Source harus berupa file biasa.",
        location,
        "FileError",
      );
    const safeFlags =
      process.platform === "win32"
        ? 0
        : (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0);
    handle = await open(file, constants.O_RDONLY | safeFlags);
    const stat = await handle.stat();
    if (!stat.isFile())
      throw new SasakError(
        "Source harus berupa file biasa.",
        location,
        "FileError",
      );
    const max = budget.limits.sourceBytes;
    if (stat.size > max)
      budget.abort("File source melebihi batas ukuran.", location);
    const buffer = Buffer.alloc(max + 1);
    let length = 0;
    while (length <= max) {
      budget.check(location);
      const { bytesRead } = await handle.read(
        buffer,
        length,
        buffer.length - length,
        null,
      );
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > max)
      budget.abort("File source melebihi batas ukuran.", location);
    return buffer.toString("utf8", 0, length);
  } catch (error) {
    if (error instanceof SasakError) throw error;
    throw new SasakError(
      "File tidak dapat dibaca. Periksa path dan izin akses.",
      location,
      "FileError",
    );
  } finally {
    await handle?.close();
  }
}
