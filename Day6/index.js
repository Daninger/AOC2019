const INPUT = require("fs")
  .readFileSync("./Day6/data.txt")
  .toString();

function parseEdges(string) {
  return string.split("\n").map(s => s.split(")"));
}

function createTree(edges, root = "COM") {
  const tree = edges.reduce((tree, [n1, n2]) => {
    n1 in tree ? tree[n1].push(n2) : (tree[n1] = [n2]);
    n2 in tree ? tree[n2].push(n1) : (tree[n2] = [n1]);
    return tree;
  }, {});
  tree.size = Object.keys(tree).length;
  tree.root = root;
  return tree;
}

function traverseTree(tree) {
  let i = 0;
  const level = [];
  let nextNodes = [tree.root];
  while (i < tree.size) {
    if (!nextNodes.length) {
      break;
    }
    let next = [];
    for (node of nextNodes) {
      const edges = tree[node].filter(
        n => n !== tree.root && !level.some(l => l.includes(n))
      );
      if (edges && edges.length) {
        level[i] = (level[i] || []).concat(edges);
        next = next.concat(edges);
      }
    }
    nextNodes = next;
    i++;
  }
  return level;
}

function sumOfTotalOrbits(input = INPUT) {
  const tree = traverseTree(createTree(parseEdges(input)));
  return tree.reduce(
    (acc, value, index) => (acc += (index + 1) * value.length),
    0
  );
}

console.log(sumOfTotalOrbits()); // -> 253104

// PART 2

function shortestPath(a, b, input = INPUT) {
  const levels = traverseTree(createTree(parseEdges(input), a));
  return levels.findIndex(v => v.includes(b)) - 1;
}

console.log(shortestPath("YOU", "SAN")); // -> 499
