const Computer = require("../Computer");
const computer = Computer.load("./Day13/input.txt");

computer.run();

console.log(
    "part 1: number of block tile is",
    computer.getOutput().reduce((acc, l, index) => {
        if ((index + 1) % 3 === 0 && l === 2) {
            acc++;
        }
        return acc;
    }, 0)
);