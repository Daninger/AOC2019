const {
  opcode1,
  opcode2,
  opcode3,
  opcode4,
  opcode5,
  opcode6,
  opcode7,
  opcode8,
  opcode9
} = require("./opcodes");

module.exports = class Computer {
  constructor(programInput) {
    this.programInput = programInput;
    this.init();
  }

  init() {
    this.program = require("fs")
      .readFileSync(this.programInput)
      .toString()
      .split(",")
      .map(s => Number(s));
    this.index = 0;
    this.output = [];
    this.input = [];
    this.inputIdx = 0;
    this.relativeBase = 0;
  }

  reset() {
    this.init();
  }

  static load(input) {
    return new Computer(input);
  }

  setInput(value) {
    this.input.push(value);
  }

  setRelativeBase = value => {
    this.relativeBase = value;
  };

  incrementRelativeBase = value => (this.relativeBase += value);

  getOutput() {
    return this.output;
  }

  getLastOutput() {
    return this.output[this.output.length - 1];
  }

  run() {
    let program = this.program;
    while (true) {
      const { opcode, parameters } = parseOpcode(program[this.index]);
      const result = executeOpcode(
        opcode,
        this._nextInput,
        this.output,
        this.incrementRelativeBase
      )(this.index, program, parameters, () => this.relativeBase);
      if (typeof result === "number") {
        this.index = result;
      } else {
        return result;
      }
    }
  }

  isDone() {
    return this.done;
  }

  _nextInput = () => {
    const next = this.input[this.inputIdx];
    if (next != null) {
      this.inputIdx++;
    }
    return next;
  };
};

function executeOpcode(code, getInput, output, setRelativeBase) {
  switch (code) {
    case 1:
      return opcode1;
    case 2:
      return opcode2;
    case 3:
      const input = getInput();
      if (input == null) {
        return () => "SET_INPUT";
      }
      return opcode3(input);
    case 4:
      return opcode4(output);
    case 5:
      return opcode5;
    case 6:
      return opcode6;
    case 7:
      return opcode7;
    case 8:
      return opcode8;
    case 9:
      return opcode9(setRelativeBase);
    case 99:
      this.done = true;
      return () => "DONE";
    default:
      return () => "ERROR";
  }
}

function parseOpcode(number) {
  const str = String(number);
  const opcode = Number(
    str.charAt(str.length - 2) + str.charAt(str.length - 1)
  );
  const parameters = [
    Number(str.charAt(str.length - 3)) || 0,
    Number(str.charAt(str.length - 4)) || 0,
    Number(str.charAt(str.length - 5)) || 0
  ];
  return { opcode, parameters };
}
