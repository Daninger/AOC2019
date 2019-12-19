const Computer = require("../Day11/computer");

function scan(x, y) {
  let computer = Computer.load("./Day19/input.txt");
  computer.setInput(x);
  computer.setInput(y);
  while (computer.run());
  return computer.getLastOutput();
}

function affectedPointInTractorBeam(size = 50) {
  let affected = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let s = scan(x, y);
      affected += s;
    }
  }
  return affected;
}

console.log("Answer to part1 is:", affectedPointInTractorBeam(50));
