const computer = require("../Computer").load("./Day9/input.txt");

computer.setInput(1);
computer.run();
console.log("Answer part1", computer.getLastOutput());

computer.reset();
computer.setInput(2);
computer.run();
console.log("Answer part2", computer.getLastOutput());