const ROBOT_BRAIN = require("fs")
  .readFileSync("./Day11/data.txt")
  .toString()
  .split(",")
  .map(s => Number(s));

const computer = require("./Computer").load("./Day11/data.txt");

class CameraComputer {
  constructor(computer = require("../Day9/computer"), program = ROBOT_BRAIN) {
    this.state = program;
    this.computer = computer;
    this.index = 0;
  }

  calculate(input) {
    const { output } = this.computer(input);
    const result = [output[this.index], output[this.index + 1]];
    this.index++;
    return result;
  }
}

// ugh javascript is a bitch sometimes
const mod = (n, m) => ((n % m) + m) % m;

class Ship {
  constructor(size = 10) {
    this.panels = [...Array(size).fill(Array(size).fill(0))];
  }

  getColorAt([x, y]) {
    return this.panels[x][y];
  }

  changePanelColor([x, y], color) {
    this.panels[x][y] = color;
  }

  get size() {
    return this.panels.length;
  }
}

class Robot {
  constructor(ship) {
    this.directionCode = 0;
    this.position = [ship.size / 2, ship.size / 2];
    this.ship = ship;
    this.visited = new Set();
    this.visited.add(this.position.join(","));
    this.camera = new CameraComputer();
  }

  useCamera() {
    const color = this.ship.getColorAt(this.position);

    const [paintCode, turnCode] = this.camera.calculate(color);
    return { paintCode, turnCode };
  }

  run() {
    // let x = 0;
    // while (!computer.isDone()) {
    //   let color = this.ship.getColorAt(this.position);
    //   computer.setInput(color);
    //   while (computer.run());
    //   let output = computer.getOutput();
    //   this.paint(output[x++]);
    //   this.move(output[x++]);
    //   this.visited.add(this.position.join(","));
    // }
    let iteration = 0;
    while (iteration < 20000) {
      const { paintCode, turnCode } = this.useCamera();
      if (paintCode == null) {
        break;
      }
      this.paint(paintCode);
      this.move(turnCode);
      this.visited.add(this.position.join(","));
      iteration++;
    }
  }

  paint(color) {
    this.ship.changePanelColor(this.position, color);
  }

  move(instruction = 0) {
    instruction === 0 ? this.turnLeft() : this.turnRight();
    this.moveForward();
  }

  moveForward() {
    switch (this.direction) {
      case "UP":
        this.position[1]--;
        break;
      case "DOWN":
        this.position[1]++;
        break;
      case "LEFT":
        this.position[0]--;
        break;
      case "RIGHT":
        this.position[0]++;
        break;
    }
  }

  turnLeft() {
    this.directionCode = mod(this.directionCode - 1, 4);
  }

  turnRight() {
    this.directionCode = mod(this.directionCode + 1, 4);
  }

  get direction() {
    switch (this.directionCode) {
      case 0:
        return "UP";
      case 1:
        return "RIGHT";
      case 2:
        return "DOWN";
      case 3:
        return "LEFT";
    }
  }
}

const ship = new Ship(1000);
const robot = new Robot(ship);
robot.run();
console.log(robot.visited);
