class Maze {
  constructor(root, nodes) {
    for (let node of nodes) {
      if (node.canBeEleminated()) {
        node.removed = true;
        const n1 = node.neighbors[0];
        const n2 = node.neighbors[1];
        if (n1 && n2) {
          n1.addNeighbor(n2, n1.removeNeighbor(node) + 1);
          n2.addNeighbor(n1, n2.removeNeighbor(node) + 1);
        } else if (n1) {
          n1.removeNeighbor(node);
        } else if (n2) {
          n2.removeNeighbor(node);
        }
      }
    }

    nodes
      .filter(it => it.neighbors.length === 1 && it.isPath)
      .forEach(node => {
        node.removed = true;
        node.neighbors[0].removeNeighbor(node);
      });

    this.nodes = nodes.filter(it => !it.removed);
  }

  static load(input) {
    const lines = require("fs")
      .readFileSync(input)
      .toString()
      .split("\n");

    let nodes = [];
    let root;
    for (let i in lines) {
      const chars = lines[i].split("");
      for (let j in chars) {
        const n = Node.create(i, j, chars[j]);
        if (n) {
          if (n.isRoot) {
            root = n;
          }
          nodes.push(n);
        }
      }
    }
    for (let node of nodes) {
      for (let other of nodes) {
        if (
          (other.i === node.i && Math.abs(other.j - node.j) === 1) ||
          (other.j === node.j && Math.abs(other.i - node.i) === 1)
        ) {
          node.addNeighbor(other);
        }
      }
    }
    return new Maze(root, nodes);
  }
}

class Node {
  neighbors = [];
  distance = [];
  removed = false;
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  get id() {
    return i + "," + j;
  }

  equals(other) {
    return other.i == this.i && other.j == this.j;
  }

  canBeEleminated() {
    return this.isPath === true && this.neighbors.length < 3;
  }

  addNeighbor(node, distance = 1) {
    this.neighbors.push(node);
    this.distance.push(distance);
  }
  removeNeighbor(node) {
    const index = this.neighbors.indexOf(node);
    if (index > -1) {
      this.neighbors.splice(index, 1);
      const d = this.distance[index];
      this.distance.splice(index, 1);
      return d;
    }
  }
  static create(i, j, symbol) {
    if (symbol === "@") {
      return new Root(i, j);
    }
    if (symbol === ".") {
      return new Path(i, j);
    }
    if (/[A-Z]+/.test(symbol)) {
      return new Door(i, j).for(symbol);
    }
    if (/[a-z]+/.test(symbol)) {
      return new Key(i, j).for(symbol);
    }
  }
}

class Root extends Node {
  isRoot = true;
}
class Path extends Node {
  isPath = true;
}
class Door extends Node {
  isDoor = true;
  for(door) {
    this.door = door;
    return this;
  }
}
class Key extends Node {
  isKey = true;
  for(key) {
    this.key = key;
    return this;
  }
}

const maze = Maze.load("./Day18/input.txt");
