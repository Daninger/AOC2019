class Program {
  constructor(pCode = []) {
    this.code = pCode;
    this.relativeBase = 0;
    this.ix = 0;
  }

  getPosition() {
    return this.ix;
  }

  setPosition(i) {
    this.ix = i;
  }

  get(pix) {
    return this.code[pix];
  }
  set(pix, value) {
    this.code[pix] = value;
  }
  getOpCode() {
    return this.code[this.ix];
  }

  // tag::getIndex[]
  getIndex(mode, parameter) {
    switch (mode) {
      case 0: //position mode
        return this.code[this.ix + parameter];
      case 1: //immediate mode
        return this.ix + parameter;
      case 2: //relative mode
        return this.code[this.ix + parameter] + this.relativeBase;
    }

    throw new Error("Mode " + mode + " is not supported yet");
  }
  // end::getIndex[]

  // tag::getInput1[]
  getInput1(mode) {
    let i = this.getIndex(mode, 1);

    //check if index in code exists
    if (this.code[i] !== void 0) return this.code[i];
    return 0;
  }
  // end::getInput1[]

  getInput2(mode) {
    let i = this.getIndex(mode, 2);

    //check if index in code exists
    if (this.code[i] !== void 0) return this.code[i];
    return 0;
  }

  setInput(mode, result) {
    let i = this.getIndex(mode, 1);
    this.code[i] = result;
  }
  setResult(mode, result) {
    let i = this.getIndex(mode, 3);
    this.code[i] = result;
  }

  incrRelativeBase(value) {
    this.relativeBase += value;
  }

  next(steps) {
    this.ix += steps;
  }
}

module.exports = Program;
