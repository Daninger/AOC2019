const SAMPLE = require("fs")
  .readFileSync("./Day14/input.txt")
  .toString()
  .split("\n")
  .map(parse);

function parse(equation) {
  const [left, right] = equation.split("=>").map(s => s.trim());
  const extract = v => {
    const r = v.split(" ");
    return { value: r[0], ingredient: r[1] };
  };
  const input = left
    .split(",")
    .map(s => s.trim())
    .map(extract);
  const output = extract(right);

  return { input, output };
}

let stock = {};
let ore = 0;

function produce(
  toProduce = 1,
  ingredient = "FUEL",
  equations = SAMPLE,
  reset = true
) {
  if (reset) {
    stock = {};
    ore = 0;
  }
  if (stock[ingredient] && stock[ingredient] > 0) {
    toProduce -= stock[ingredient];
    stock[ingredient] = 0;
  }
  const formula = equations.find(e => e.output.ingredient === ingredient);
  if (!formula) {
    return stock;
  }
  const factor = multiplier(toProduce, formula.output.value);
  const rest = formula.output.value * factor - toProduce;
  if (rest < 0) {
    throw Error("Oops we did something wrong");
  }
  stock[formula.output.ingredient] =
    (stock[formula.output.ingredient] || 0) + rest;
  const oreFormula = formula.input.find(it => it.ingredient === "ORE");
  if (oreFormula) {
    ore += factor * oreFormula.value;
  }

  formula.input.forEach(v =>
    produce(v.value * factor, v.ingredient, equations, (reset = false))
  );
  return ore;
}

function multiplier(toProduce, minimumProductionOutput) {
  return Math.ceil(toProduce / minimumProductionOutput);
}

console.log(produce());

// PART 2

function findMaximumAmountOfFUEL(value) {
  const TRILL = 1000000000000;
  const min = Math.floor(TRILL / value);
  let a = min;
  let b = 2 * min;
  let m = () => Math.floor(a + (b - a) / 2);
  while (b - a > 1) {
    let next = m();
    const produced = produce(next);
    if (produced === TRILL) {
      return next;
    } else if (produced > TRILL) {
      b = next;
    } else {
      a = next;
    }
  }
  return m();
}

console.log(findMaximumAmountOfFUEL(720484));
