// still need to fix computer of day9
const Computer = require("../Day11/computer");
const computer = Computer.load("./Day13/input.txt");

while (!computer.isDone()) {
  computer.run();
}

console.log(
  "part 1: number of block tile is",
  computer.getOutput().reduce((acc, l, index) => {
    if ((index + 1) % 3 === 0 && l === 2) {
      acc++;
    }
    return acc;
  }, 0)
);
