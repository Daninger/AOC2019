function secureContainer(
  isValidCombination = next =>
    isIncreasing(next) && hasTwoIdenticalDigits(next),
  start = 136818,
  end = 685979
) {
  let validCombinationCount = 0;
  for (let next = start; next <= end; next++) {
    if (isValidCombination(next)) {
      validCombinationCount++;
    }
  }
  return validCombinationCount;
}

const isIncreasing = number =>
  Number(
    String(number)
      .split("")
      .map(Number)
      .sort()
      .reduce((acc, next) => "" + acc + next)
  ) === number;

const hasTwoIdenticalDigits = number =>
  String(number)
    .split("")
    .reduce(
      (result, next, nextIndex, arr) => next === arr[nextIndex + 1] || result,
      false
    );

console.log(secureContainer());

// PART 2

const hasExactlyTwoIdenticalDigits = number =>
  String(number)
    .split("")
    .reduce(
      (result, next, nextIndex, arr) =>
        (next === arr[nextIndex + 1] &&
          next !== arr[nextIndex + 2] &&
          next !== arr[nextIndex - 1]) ||
        result,
      false
    );

console.log(
  secureContainer(i => isIncreasing(i) && hasExactlyTwoIdenticalDigits(i))
);
