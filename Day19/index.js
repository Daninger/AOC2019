const Computer = require("../Day11/computer");

function scan(x, y) {
  let computer = Computer.load("./Day19/input.txt");
  computer.setInput(x);
  computer.setInput(y);
  while (computer.run());
  return computer.getLastOutput();
}

function affectedPointInTractorBeam(size = 50) {
  let affected = 0;
  let out = "";
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let s = scan(x, y);
      out += s ? "#" : ".";
      affected += s;
    }
    out += "\n";
  }
  console.log(out);
  return affected;
}

// console.log("Answer to part1 is:", affectedPointInTractorBeam(100));

// PART2

function getFirstRowWith100Attractions(size = 50, xoffset, yoffset) {
  let rowCount = 0;
  let firstYWith100;
  let out = "";
  for (let y = 0; y < size; y++) {
    rowCount = 0;
    for (let x = 0; x < size; x++) {
      let s = scan(x + xoffset, y + yoffset);
      out += s ? "#" : ".";
      rowCount += s;
    }
    out += rowCount + " " + (y + yoffset);
    out += "\n";
  }
  console.log(out);
  return firstYWith100 + yoffset;
}

// 803/ 651
// console.log(getFirstRowWith100Attractions(150, 700, 650)); // 972

function findNextRightTop(previous) {
  for (let i = 0; i < 10; i++) {
    if (scan(previous.x + i, previous.y + 1) == 0) {
      return { x: previous.x + (i - 1), y: previous.y + 1 };
    }
  }
}

function containsRect(start, size = 99) {
  let right = scan(start.x, start.y);
  let leftTop = scan(start.x - size, start.y);
  let bottomLeft = scan(start.x - size, start.y + size);
  if (right === 1 && leftTop === 1 && bottomLeft === 1) {
    return true;
  }
  return false;
}

function findPointContaining100Times100Square(start = { x: 803, y: 651 }) {
  let next = start;
  let it = 0;
  while (!containsRect(next)) {
    it++;
    it % 10 === 0 && console.log(it);
    next = findNextRightTop(next);
  }
  return { ...next, x: next.x - 99 };
}

console.log("Answer to part2 is", findPointContaining100Times100Square());
