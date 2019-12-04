const data = require("fs")
  .readFileSync("./data.txt")
  .toString()
  .split("\n");

const fuel = amount => Math.floor(amount / 3) - 2;

const result = data.reduce((acc, next) => {
  acc += fuel(next);
  return acc;
}, 0);

console.log("You answer:", result);

function totalFuel(input) {
  let result = 0;
  let next = input;
  while (next > 0) {
    next = fuel(next);
    result += next > 0 ? next : 0;
  }
  return result;
}

const resultPart2 = data.reduce((acc, next) => {
  acc += totalFuel(next);
  return acc;
}, 0);

console.log("Your answer part 2:", resultPart2);
