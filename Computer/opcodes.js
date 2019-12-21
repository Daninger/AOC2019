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
const opcode3 = input => (index, program, parameter, offset) => {
  writeValue(input)(index + 1, program, parameter[0], offset);
  return index + 2;
};
const opcode4 = output => (index, program, parameter, offset) => {
  output.push(readValue(index + 1, program, parameter[0], offset));
  return index + 2;
};
const opcode5 = opcodeJump(value => value !== 0);
const opcode6 = opcodeJump(value => value === 0);
const opcode7 = opcodeCompare((first, second) => first < second);
const opcode8 = opcodeCompare((first, second) => first === second);
const opcode9 = setRelativeBaseOffset => (
  index,
  program,
  parameter,
  offset
) => {
  setRelativeBaseOffset(readValue(index + 1, program, parameter[0], offset));
  return index + 2;
};

module.exports = {
  opcode1,
  opcode2,
  opcode3,
  opcode4,
  opcode5,
  opcode6,
  opcode7,
  opcode8,
  opcode9
};
