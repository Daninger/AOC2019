// 1,0,-1,0

const TEST = "69317163492948606335995924319873".split("").map(Number);
const SIGNAL = require("fs")
  .readFileSync("./Day16/input.txt")
  .toString()
  .split("")
  .map(Number);

function fft(signal = SIGNAL, steps = 0) {
  if (steps > 99) {
    return signal;
  }
  let next = [];
  for (let i = 0; i < signal.length; i++) {
    const multipliers = getMultipliers(signal, i);
    const str = String(
      Math.abs(
        signal.reduce((acc, number, index) => {
          acc += multipliers[index] * number;
          return acc;
        }, 0)
      )
    ).split("");
    next[i] = Number(str[str.length - 1]);
  }
  return fft(next, steps + 1);
}

console.log(
  "Solution part 1",
  fft()
    .slice(0, 8)
    .join("")
);

function getMultipliers(signal, offset) {
  let pattern = [0, 1, 0, -1];
  let result = [];
  let operatorIndex = 0;
  for (let i = 0; i < signal.length + 1; i++) {
    // console.log(pattern[operatorIndex] + "*" + i);
    if (i <= offset) {
      operatorIndex = 0;
    } else if (i % (offset + 1) === 0) {
      operatorIndex = (operatorIndex + 1) % 4;
    }
    if (i > 0) {
      result[i - 1] = pattern[operatorIndex];
    }
  }
  return result;
}
