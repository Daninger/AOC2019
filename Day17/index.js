const ASCII = require("../Computer").load("./Day17/input.txt");

ASCII.run();

const MAP = ASCII.getOutput()
  .map(it => String.fromCharCode(it))
  .join("");

// require("fs").writeFileSync("./Day17/map.txt",v)

const MAP = require("fs")
  .readFileSync("./Day17/map.txt")
  .toString();

const matrix = MAP.split("\n").map(line => line.split(""));

const get = (i, j) => (matrix[Number(i)] || [])[Number(j)];
const isPath = (i, j) => get(i, j) === "#";

let sum = 0;
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (
      isPath(i, j) &&
      isPath(i + 1, j) &&
      isPath(i - 1, j) &&
      isPath(i, j - 1) &&
      isPath(i, j + 1)
    ) {
      sum += i * j;
    }
  }
}
console.log("answer part 1", sum);
