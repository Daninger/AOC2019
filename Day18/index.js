class Maze {
    collectedKeys = [];
    keysToFind = 0;
    shortestPath = 0;
    visited = new Set();

    constructor(root, nodes) {
        this.root = root;
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
        const mazeStr = require("fs")
            .readFileSync(input)
            .toString();

        const lines = mazeStr.split("\n");

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
                    if (n.isKey) {
                        this.keysToFind++;
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
    constructor(i, j, symbol) {
        this.i = Number(i);
        this.j = Number(j);
        this.symbol = symbol;
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

    getNeighbor(i) {
        return { neighbor: this.neighbors[i], distance: this.distance[i] };
    }

    getNeighbors() {
        return this.neighbors.map((_, i) => this.getNeighbor(i));
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
            return new Root(i, j, symbol);
        }
        if (symbol === ".") {
            return new Path(i, j, symbol);
        }
        if (/[A-Z]+/.test(symbol)) {
            return new Door(i, j, symbol);
        }
        if (/[a-z]+/.test(symbol)) {
            return new Key(i, j, symbol);
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

    get door() {
        return this.symbol;
    }

    canPass(keys) {
        return keys.includes(this.door.toLowerCase());
    }
}
class Key extends Node {
    isKey = true;

    get key() {
        return this.key;
    }
}

const maze = Maze.load("./Day18/input.txt");


let out = "";
for (let i = 0; i < 82; i++) {
    for (let j = 0; j < 82; j++) {
        let sign = undefined;
        for (node of maze.nodes) {
            if (node.i === i && node.j === j) {
                sign = node.symbol;
                break;
            }
            for ({ neighbor, distance }
                of node.getNeighbors()) {
                if (i == node.i && j <= neighbor.j && node.j <= j) {
                    sign = "-";
                    break;
                } else if (j == node.j && i <= neighbor.i && node.i <= i) {
                    sign = "|";
                    break;
                }
            }
        }
        out += sign || " ";
    }
    out += "\n";
}

require("fs").writeFileSync("./Day18/mace.txt", out);