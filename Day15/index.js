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

const computer = Computer.load("./Day15/input.txt");

function getNextStatus(input) {
  computer.setInput(input);
  while (!computer.isDone()) {
    while (computer.run());
    return computer.getLastOutput();
  }
}

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

const str = v => v[0] + "," + v[1];

function Droid() {
  let map = [];
  let pos = [0, 0];
  let going = undefined;
  let visited = new Map();
  let path = [];
  return {
    path,
    visited,
    getMap: () => map,
    getPos: () => pos,
    run() {
      let free = 0;
      let nextDir = 0;
      let unvisitedDir = 0;
      for (let i = 1; i <= 4; i++) {
        let status = getNextStatus(i);
        this.markPositionInMap(
          status === 0 ? "WALL" : status === 1 ? "FREE" : "OXYGEN",
          i
        );
        if (status === 1) {
          getNextStatus(opositeDirection(i));
          const nextPos = this.wouldMove(i);
          free++;
          if (visited.has(str(nextPos)) && visited.get(str(nextPos)) <= 0) {
            continue;
          }
          if (!visited.has(str(nextPos))) {
            unvisitedDir = i;
          }
          nextDir = i;
        } else if (status === 2) {
          console.log("FOUND oxygen", this.wouldMove(i));
          return true;
        }
      }

      const id = str(pos);
      if (!visited.has(id)) {
        visited.set(id, free);
      }
      console.log(id, free);

      let dir = nextDir || unvisitedDir;
      if (dir) {
        getNextStatus(dir);
        this.changeDirection(dir);
        this.move(dir);
        const it = visited.get(id);
        visited.set(id, it - 1);
      }
    },
    markPositionInMap(symbol, i) {
      let next = this.wouldMove(i);
      map[next[0]] = map[next[0]] || [];
      map[next[0]][next[1]] = MapMarker[symbol];
    },
    changeDirection(g = movementCommand.SOUTH) {
      going = Number(g);
    },
    wouldMove(i) {
      let current = pos.slice();
      switch (Number(i)) {
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
      pos = next;
    }
  };
}

function findOxygenSytem() {
  const droid = Droid();
  let iteration = 0;
  while (iteration < 10) {
    iteration++;
    if (droid.run()) {
      return droid;
    }
  }
  return droid;
}

function printMap(map, pos) {
  let s = "";
  for (y = -100; y < 100; y++) {
    for (x = -100; x < 100; x++) {
      if (x === 0 && y === 0) {
        //process.stdout.write("O");
        s += "O";
        continue;
      }
      if (str([y, x]) === str(pos)) {
        s += "D";
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

const d = findOxygenSytem();
const s = printMap(d.getMap(), d.getPos());
console.log(d.visited, d.getPos());
require("fs").writeFileSync("./Day15/map.txt", s);

module.exports = getNextStatus;
