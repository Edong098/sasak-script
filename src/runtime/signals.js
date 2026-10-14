/** Sinyal internal bukan error bahasa; ditangani batas loop/fungsi. */
export class BreakSignal {}
export class ContinueSignal {}
export class ReturnSignal {
  constructor(value) {
    this.value = value;
  }
}
export class ThrowSignal {
  constructor(value, location) {
    this.value = value;
    this.location = location;
  }
}
