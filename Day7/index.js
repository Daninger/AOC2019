const SAMPLE_PROGRAM = require("fs")
  .readFileSync("./data.txt")
  .toString()
  .split(",")
  .map(s => Number(s));

function intCodeComputer(input, program = [3, 0, 4, 0, 99]) {
  let index = 0;
  let output = [];
  while (index < program.length) {
    const { opcode, parameters } = parseOpcode(program[index]);
    index = executeOpcode(opcode, input, output)(index, program, parameters);
    if (index === -1) {
      return { output, program };
    }
  }
}

function executeOpcode(code, input, output) {
  switch (code) {
    case 1:
      return opcode1;
    case 2:
      return opcode2;
    case 3:
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
    case 99:
    default:
      return -1;
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

const readValue = (index, programm, parameter = 0) =>
  programm[parameter ? index : programm[index]];

const writeValue = value => (index, programm, parameter = 0) =>
  (programm[parameter ? index : programm[index]] = value);

function opcodeArithmetic(operation) {
  return (index, program, parameter) => {
    const result = operation(
      readValue(index + 1, program, parameter[0]),
      readValue(index + 2, program, parameter[1])
    );
    writeValue(result)(index + 3, program, parameter[2]);
    return index + 4;
  };
}
const opcodeJump = cond => (index, program, parameter) =>
  cond(readValue(index + 1, program, parameter[0]))
    ? readValue(index + 2, program, parameter[1])
    : index + 3;

const opcodeCompare = compare => (index, program, parameter) => {
  const first = readValue(index + 1, program, parameter[0]);
  const second = readValue(index + 2, program, parameter[1]);
  writeValue(compare(first, second) ? 1 : 0)(index + 3, program, parameter[2]);
  return index + 4;
};

const opcode1 = opcodeArithmetic((a, b) => a + b);
const opcode2 = opcodeArithmetic((a, b) => a * b);
const opcode3 = input => (index, program, parameter) =>
  writeValue(input)(index + 1, program, parameter[0]) && index + 2;
const opcode4 = output => (index, program, parameter) =>
  output.push(readValue(index + 1, program, parameter[0])) && index + 2;
const opcode5 = opcodeJump(value => value !== 0);
const opcode6 = opcodeJump(value => value === 0);
const opcode7 = opcodeCompare((first, second) => first < second);
const opcode8 = opcodeCompare((first, second) => first === second);

console.log(intCodeComputer(1, SAMPLE_PROGRAM.slice()).output);

// PART 2
console.log(intCodeComputer(5, SAMPLE_PROGRAM.slice()).output);
