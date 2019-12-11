const fs = require("fs");
const Program = require("./Program");

class Computer {
  constructor(program) {
    this.program = program;
    this.output = [];
    this.input = [];
    this.ixInput = 0;
    this.state = "INIT";
  }

  static load(filename) {
    let data = fs.readFileSync(filename).toString("utf-8");
    let code = data.split(",").map(c => parseInt(c));
    return new Computer(new Program(code));
  }

  setInput(val) {
    this.input.push(val);
  }
  getOutput() {
    return this.output;
  }

  getLastOutput() {
    return this.output[this.output.length - 1];
  }

  isDone() {
    return this.state == "Done";
  }
  run() {
    let abcde = "00000" + this.program.getOpCode();
    let l = abcde.length;

    let de = parseInt(abcde.substring(l - 2, l));
    let c = parseInt(abcde.substring(l - 3, l - 2));
    let b = parseInt(abcde.substring(l - 4, l - 3));
    let a = parseInt(abcde.substring(l - 5, l - 4));

    switch (de) {
      case 1:
        var input1 = this.program.getInput1(c);
        var input2 = this.program.getInput2(b);
        this.program.setResult(a, input1 + input2);
        this.program.next(4);
        break;
      case 2:
        var input1 = this.program.getInput1(c);
        var input2 = this.program.getInput2(b);
        this.program.setResult(a, input1 * input2);
        this.program.next(4);
        break;
      case 3:
        if (this.ixInput < this.input.length) {
          let inputVal = this.input[this.ixInput++];
          this.program.setInput(c, inputVal);
          this.program.next(2);
          break;
        }
        this.state = "WaitingForInput";
        return false;
      case 4:
        var input1 = this.program.getInput1(c);
        this.output.push(input1);
        this.program.next(2);
        break;
      case 5: //jump-if-true
        var input1 = this.program.getInput1(c);
        var input2 = this.program.getInput2(b);
        if (input1 != 0) {
          this.program.setPosition(input2);
        } else {
          this.program.next(3);
        }
        break;
      case 6: //jump-if-false
        var input1 = this.program.getInput1(c);
        var input2 = this.program.getInput2(b);
        if (input1 == 0) {
          this.program.setPosition(input2);
        } else {
          this.program.next(3);
        }
        break;
      case 7: //less
        var input1 = this.program.getInput1(c);
        var input2 = this.program.getInput2(b);
        if (input1 < input2) {
          this.program.setResult(a, 1);
        } else {
          this.program.setResult(a, 0);
        }
        this.program.next(4);
        break;
      case 8: //equals
        var input1 = this.program.getInput1(c);
        var input2 = this.program.getInput2(b);
        if (input1 == input2) {
          this.program.setResult(a, 1);
        } else {
          this.program.setResult(a, 0);
        }
        this.program.next(4);
        break;
      // tag::opcode9[]
      case 9:
        var input1 = this.program.getInput1(c);
        this.program.incrRelativeBase(input1);
        this.program.next(2);
        break;
      // end::opcode9[]

      case 99:
        this.state = "Done";
        return false;
      default:
        throw new Error();
    }
    return true;
  }
}

module.exports = Computer;
