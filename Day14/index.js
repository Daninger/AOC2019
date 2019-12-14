const SAMPLE = require("fs")
  .readFileSync("./Day14/data.txt")
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

function produce(equations = SAMPLE, ingredient = "FUEL") {
  const formula = equations.find(e => e.output.ingredient === ingredient);
  if (!formula) {
    return equations;
  }
  formula.input.forEach(v => (v.value *= formula.output.value));
  formula.input.forEach(v => produce(equations, v.ingredient));
}

console.log(produce());
