const MAZE = require("fs")
  .readFileSync("./Day20/input.txt")
  .toString();

const Graph = require("./graph");

function parse(maze = MAZE) {
  const graph = new Graph();
  let matrix = maze.split("\n").map(line => line.split(""));
  let nodes = [];
  const isPortal = char => (char ? /[A-Z]+/.test(char) : false);
  const isPath = char => char === ".";
  const addNode = (i, j, portal) => {
    const node = {
      i,
      j,
      portal,
      symbol: portal || ".",
      get id() {
        if (this.symbol === "AA" || this.symbol === "ZZ") {
          return this.symbol;
        } else if (this.symbol !== ".") {
          return `${this.symbol}:${this.i},${this.j}`;
        }
        return `${this.i},${this.j}`;
      }
    };
    nodes.push(node);
  };

  for (let i = 0; i < matrix.length; i++) {
    let line = matrix[i];
    const get = (i, j) => (matrix[i] || [])[j];
    const set = (i, j, v) => ((matrix[i] || [])[j] = v);
    for (let j = 0; j < line.length; j++) {
      let char = line[j];
      let portal;
      if (isPortal(char)) {
        // portal to right
        if (isPortal(line[j + 1]) && isPath(line[j + 2])) {
          portal = char + line[j + 1];
          j += 2;
          addNode(i, j, portal);
        }
        // portal down
        else if (isPortal(get(i + 1, j)) && isPath(get(i + 2, j))) {
          portal = get(i, j) + get(i + 1, j);
          addNode(i + 2, j, portal);
          set(i + 1, j, "$");
          set(i + 2, j, "$");
        }
      } else if (isPath(char)) {
        // portal left
        if (isPortal(line[j + 1]) && isPortal(line[j + 2])) {
          portal = line[j + 1] + line[j + 2];
          addNode(i, j, portal);
          j += 2;
        }
        // portal up
        else if (isPortal(get(i + 1, j)) && isPortal(get(i + 2, j))) {
          portal = get(i + 1, j) + get(i + 2, j);
          addNode(i, j, portal);
          set(i + 1, j, "$");
          set(i + 2, j, "$");
        } else {
          addNode(i, j);
        }
      }
    }
  }
  for (let node of nodes) {
    for (let other of nodes) {
      if (
        (other.i === node.i && Math.abs(other.j - node.j) === 1) ||
        (other.j === node.j && Math.abs(other.i - node.i) === 1) ||
        (node.portal && node.portal === other.portal)
      ) {
        graph.addEdge(node.id, other.id);
      }
    }
  }

  return graph;
}

console.log("answer to part 1", parse().shortestPath("AA", "ZZ").distance);
