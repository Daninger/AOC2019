const Computer = require("../Computer");
const Panel = require("./Panel");

let computer = Computer.load("./Day11/input.txt");

let panel = new Panel();

let x = 0;
while (true) {
    computer.setInput(panel.getColor())
    computer.run()
    const output = computer.getOutput()
    if (output[x] == undefined) {
        break;
    }
    panel.setColor(output[x++]);
    panel.turn(output[x++]);
    panel.moveForward();
}
console.log("My puzzle answer is " + panel.countPanels());