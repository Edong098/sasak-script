/** Promise runtime: pembungkus mencegah evaluator host melakukan await implisit. */
export class SasakPromise {
  constructor(promise) {
    this.kind = 'promise'; this.observed = false;
    this.promise = promise;
    // Simpan rejection sebagai hasil sampai anti atau batas akhir program.
    this.outcome = promise.then(value => ({ value }), error => ({ error }));
  }
  async unwrap() {
    this.observed = true;
    const result = await this.outcome;
    if (Object.hasOwn(result, 'error')) throw result.error;
    return result.value;
  }
}
export class AsyncScheduler {
  constructor() { this.tasks = new Set(); }
  start(promise) { const task = new SasakPromise(promise); this.tasks.add(task); return task; }
  async finish() {
    // Sebuah tugas dapat membuat tugas baru; ulangi sampai semua telah selesai.
    const completed = new Set();
    for (;;) {
      const batch = [...this.tasks].filter(task => !completed.has(task));
      if (!batch.length) break;
      await Promise.all(batch.map(task => task.outcome));
      batch.forEach(task => completed.add(task));
    }
    for (const task of this.tasks) {
      const result = await task.outcome;
      if (!task.observed && Object.hasOwn(result, 'error')) throw result.error;
    }
  }
}
