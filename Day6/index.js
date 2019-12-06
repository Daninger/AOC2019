const INPUT = require("fs")
  .readFileSync("./Day6/data.txt")
  .toString();

function parseEdges(string) {
  return string.split("\n").map(s => s.split(")"));
}

function createDirectedTreeFromEdges(edges, root = "COM") {
  const tree = edges.reduce((tree, [n1, n2]) => {
    n1 in tree ? tree[n1].push(n2) : (tree[n1] = [n2]);
    !(n2 in tree) && (tree[n2] = []);
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
      const edges = tree[node];
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

function sumOfTotalOrbits(depthTree) {
  return depthTree.reduce(
    (acc, value, index) => (acc += (index + 1) * value.length),
    0
  );
}

console.log(
  sumOfTotalOrbits(traverseTree(createDirectedTreeFromEdges(parseEdges(INPUT))))
);
