const Computer = require("../Day11/computer");

const movementCommand = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
};

const opositeDirection = code => {
  if (code === 1 || code === 3) {
    return code + 1;
  } else if (code === 2 || code === 4) {
    return code - 1;
  }
};

const droidStatus = {
  0: "WALL",
  1: "MOVE",
  2: "FOUND_OXYGEN"
};

const MapMarker = {
  FREE: " ",
  WALL: "#",
  OXYGEN: "@",
  DROID: "D",
  START: "0"
};

function Droid() {
  let pos = [0, 0];
  let going;
  let map = [];
  let computer = Computer.load("./Day15/input.txt");
  return {
    pos,
    going,
    getMap: () => map,
    run() {
      let droid = this;
      let walls = 0;
      let next = null;
      for (let i = 1; i <= 4; i++) {
        if (droid.going == null || i !== opositeDirection(droid.going)) {
          const ouput = getNextStatus(computer, i);
          const status = droidStatus[ouput];
          if (status === "MOVE") {
            droid.markPositionInMap("FREE", i);
            getNextStatus(computer, opositeDirection(i));
            next = next === droid.going ? next : i;
          }
          if (status === "WALL") {
            droid.markPositionInMap("WALL", i);
            walls++;
          }
          if (status === "FOUND_OXYGEN") {
            console.log("FOUND IT", droid.pos);
            droid.markPositionInMap("OXYGEN", i);
            return true;
          }
        }
      }
      if (walls === 3) {
        droid.changeDirection(opositeDirection(droid.going));
        droid.move(droid.going);
      } else {
        droid.changeDirection(next);
        droid.move(droid.going);
      }
    },
    markPositionInMap(symbol, i) {
      let next = this.wouldMove(i);
      map[next[0]] = map[next[0]] || [];
      map[next[0]][next[1]] = MapMarker[symbol];
    },
    changeDirection(going = movementCommand.SOUTH) {
      this.going = going;
    },
    wouldMove(i) {
      let current = [...this.pos];
      switch (i) {
        case movementCommand.NORTH:
          current[1]--;
          break;
        case movementCommand.SOUTH:
          current[1]++;
          break;
        case movementCommand.EAST:
          current[0]++;
          break;
        case movementCommand.WEST:
          current[0]--;
          break;
      }
      return current;
    },
    move(direction = movementCommand.SOUTH) {
      const next = this.wouldMove(direction);
      this.pos = next;
      getNextStatus(computer, this.going);
    }
  };
}

function getNextStatus(computer, input) {
  computer.setInput(input);
  while (!computer.isDone()) {
    while (computer.run());
    return computer.getLastOutput();
  }
}

function findOxygenSytem() {
  const droid = Droid();
  let iteration = 0;
  while (iteration < 1000000) {
    iteration++;
    if (droid.run()) {
      return droid;
    }
  }
  return droid;
}

function printMap(map) {
  let s = "";
  for (y = -10; y < 50; y++) {
    for (x = -50; x < 50; x++) {
      if (x === 0 && y === 0) {
        //process.stdout.write("O");
        s += "O";
        continue;
      }
      let content = (map[y] || [])[x] || "x";
      //process.stdout.write(content);
      s += content;
    }
    s += "\n";
    //console.log();
  }
  return s;
}

const droid = findOxygenSytem();
const s = printMap(droid.getMap());

require("fs").writeFileSync("./Day15/map.txt", s);

module.exports = getNextStatus;
