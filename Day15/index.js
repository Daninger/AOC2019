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
  let visited = new Set();
  let path = [];
  return {
    path,
    visited,
    getMap: () => map,
    getPos: () => pos,
    run() {
      let sensor = {};
      for (let i = 1; i <= 4; i++) {
        let status = getNextStatus(i);
        if (status === 1) {
          getNextStatus(opositeDirection(i));
        }
        sensor[i] = status;
        this.markPositionInMap(
          status === 0 ? "WALL" : status === 1 ? "FREE" : "OXYGEN",
          i
        );
        if (status === 2) {
          console.log("FOUND oxygen", this.wouldMove(i));
          return true;
        }
      }
      if (Object.values(sensor).filter(it => it === 0).length === 3) {
        console.log("DEAD END");
      }

      let anyDirection = null;
      let bestDirection = null;
      let betterDirection = null;

      for ([direction, status] of Object.entries(sensor)) {
        if (status === 1) {
          anyDirection = direction;
          const next = this.wouldMove(direction);
          let last = path[path.length - 2];
          if (!visited.has(str(next))) {
            bestDirection = direction;
          } else if (
            last != null &&
            (next[0] !== last[0] || next[1] !== last[1])
          ) {
            betterDirection = direction;
          }
        }
      }

      let nextDirection = bestDirection || betterDirection || anyDirection;

      getNextStatus(nextDirection);
      this.changeDirection(nextDirection);
      this.move(nextDirection);
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
      visited.add(str(pos));
      path.push(str(pos));
    }
  };
}

function findOxygenSytem() {
  const droid = Droid();
  let iteration = 0;
  while (iteration < 10000) {
    iteration++;
    if (droid.run()) {
      return droid;
    }
    console.log(droid.path);
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

const d = findOxygenSytem();
const s = printMap(d.getMap());
console.log(d.path.slice(d.path.length - 100));

require("fs").writeFileSync("./Day15/map.txt", s);

module.exports = getNextStatus;
