const SAMPLE_PROGRAM = require("fs")
  .readFileSync("./data.txt")
  .toString()
  .split(",")
  .map(s => Number(s));

function intCodeComputer(input, program = [3, 0, 4, 0, 99], startOffset = 0) {
  let index = 0;
  let output = [];
  let iteration = 0;
  let relativeBaseOffset = startOffset;
  const setRelativeBaseOffset = value => (relativeBaseOffset += value);
  const getRelativeBaseOffset = () => relativeBaseOffset;

  while (true) {
    iteration++;
    const { opcode, parameters } = parseOpcode(program[index]);
    index = executeOpcode(opcode, input, output, setRelativeBaseOffset)(
      index,
      program,
      parameters,
      getRelativeBaseOffset
    );
    if (index === -1) {
      return { output, program };
    }
  }
}

function executeOpcode(code, input, output, setRelativeBaseOffset) {
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
    case 9:
      return opcode9(setRelativeBaseOffset);
    case 99:
    default:
      return () => -1;
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

const readValue = (index, programm, parameter = 0, offset) =>
  programm[
    parameter === 1 ? index : programm[index] + (parameter === 2 ? offset() : 0)
  ];

const writeValue = value => (index, programm, parameter = 0, offset) =>
  (programm[
    parameter === 1 ? index : programm[index] + (parameter === 2 ? offset() : 0)
  ] = value);

function opcodeArithmetic(operation) {
  return (index, program, parameter, offset) => {
    const result = operation(
      readValue(index + 1, program, parameter[0], offset),
      readValue(index + 2, program, parameter[1], offset)
    );
    writeValue(result)(index + 3, program, parameter[2], offset);
    return index + 4;
  };
}
const opcodeJump = cond => (index, program, parameter, offset) =>
  cond(readValue(index + 1, program, parameter[0], offset))
    ? readValue(index + 2, program, parameter[1], offset)
    : index + 3;

const opcodeCompare = compare => (index, program, parameter, offset) => {
  const first = readValue(index + 1, program, parameter[0], offset);
  const second = readValue(index + 2, program, parameter[1], offset);
  writeValue(compare(first, second) ? 1 : 0)(
    index + 3,
    program,
    parameter[2],
    offset
  );
  return index + 4;
};

const opcode1 = opcodeArithmetic((a, b) => a + b);
const opcode2 = opcodeArithmetic((a, b) => a * b);
const opcode3 = input => (index, program, parameter, offset) =>
  writeValue(input)(index + 1, program, parameter[0], offset) && index + 2;
const opcode4 = output => (index, program, parameter, offset) =>
  output.push(readValue(index + 1, program, parameter[0], offset)) && index + 2;
const opcode5 = opcodeJump(value => value !== 0);
const opcode6 = opcodeJump(value => value === 0);
const opcode7 = opcodeCompare((first, second) => first < second);
const opcode8 = opcodeCompare((first, second) => first === second);
const opcode9 = setRelativeBaseOffset => (index, program, parameter, offset) =>
  setRelativeBaseOffset(readValue(index + 1, program, parameter[0], offset)) &&
  index + 2;

console.log(intCodeComputer(2, SAMPLE_PROGRAM.slice()).output);

// PART 2
console.log(intCodeComputer(2, SAMPLE_PROGRAM.slice()).output);
