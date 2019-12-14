const SAMPLE_PROGRAM = require("fs")
  .readFileSync("./Day9/data.txt")
  .toString()
  .split(",")
  .map(s => Number(s));

const intCodeComputer = require("./computer");

const computer = () => intCodeComputer(SAMPLE_PROGRAM.slice());

console.log(computer()(1).output);

// PART 2
console.log(computer()(2).output);

module.exports = intCodeComputer;
