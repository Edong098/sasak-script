/** Promise runtime: pembungkus mencegah evaluator host melakukan await implisit. */
export class SasakPromise {
  constructor(promise, location) {
    this.location = location;
    this.kind = "promise";
    this.observed = false;
    // Simpan rejection sebagai hasil sampai anti atau batas akhir program.
    this.outcome = promise.then(
      (value) => ({ value }),
      (error) => ({ error }),
    );
  }
  async unwrap(budget, location) {
    this.observed = true;
    const result = await budget.wait(this.outcome, location);
    if (Object.hasOwn(result, "error")) throw result.error;
    return result.value;
  }
}
export class AsyncScheduler {
  constructor(budget) {
    this.budget = budget;
    this.tasks = new Set();
  }
  start(createTask, location) {
    this.budget.count("tasks", location);
    const task = new SasakPromise(createTask(), location);
    this.tasks.add(task);
    return task;
  }
  async finish() {
    // Sebuah tugas dapat membuat tugas baru; ulangi sampai semua telah selesai.
    const completed = new Set();
    for (;;) {
      const batch = [...this.tasks].filter((task) => !completed.has(task));
      if (!batch.length) break;
      await this.budget.wait(
        Promise.all(batch.map((task) => task.outcome)),
        batch[0].location,
      );
      batch.forEach((task) => completed.add(task));
    }
    for (const task of this.tasks) {
      const result = await task.outcome;
      if (!task.observed && Object.hasOwn(result, "error")) throw result.error;
    }
  }
}
