/** Sinyal internal bukan error bahasa; ditangani batas loop/fungsi. */
export class BreakSignal {}
export class ReturnSignal { constructor(value) { this.value = value; } }
