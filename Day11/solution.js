const ROBOT_BRAIN = require("fs")
  .readFileSync("./data.txt")
  .toString()
  .split(",")
  .map(s => Number(s));

const Computer = require("../Day9/computer");
const Panel = require("./Panel");

// let computer = Computer.load("data.txt");

let panel = new Panel();

let x = 0;
let relativeBaseOffset = 0;
while (true) {
  let c = panel.getColor();
  const { output, relativeBaseOffset: a } = Computer(ROBOT_BRAIN.slice(), c);
  relativeBaseOffset = a;
  if (output[x] == undefined) {
    break;
  }
  panel.setColor(output[x++]);
  panel.turn(output[x++]);
  panel.moveForward();
}
console.log("My puzzle answer is " + panel.countPanels());
