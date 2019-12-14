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

function produce(equations = SAMPLE, ingredient = "FUEL", toProduce = 1) {
  console.log(ingredient, toProduce, stock);
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
    produce(equations, v.ingredient, v.value * factor)
  );
  return ore;
}

function multiplier(toProduce, minimumProductionOutput) {
  return Math.ceil(toProduce / minimumProductionOutput);
}

console.log(produce());
