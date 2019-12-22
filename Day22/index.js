const shuffleProcess = require("fs")
  .readFileSync("./Day22/input.txt")
  .toString()
  .split("\n");

const deckOfSpaceCards = [...new Array(10007)].map((i, index) => index);

const Shuffler = (deck = deckOfSpaceCards) => {
  let stack = deck.slice();
  return {
    get stack() {
      return stack;
    },
    applyTechnique(str = "") {
      const N = Number(str.match(/[-0-9]+/));
      if (str === "deal into new stack") {
        this.dealIntoNewStack();
      } else if (str.startsWith("cut")) {
        this.cut(N);
      } else if (str.startsWith("deal with increment")) {
        this.dealWithIncrement(N);
      }
    },
    dealIntoNewStack: () => {
      stack = stack.reverse();
      return stack;
    },
    cut(N) {
      stack = stack.slice(N).concat(...stack.slice(0, N));
      return stack;
    },
    dealWithIncrement(N) {
      let result = [stack[0]];
      for (let i = 1; i < stack.length; i++) {
        result[(i * N) % stack.length] = stack[i];
      }
      stack = result;
      return stack;
    }
  };
};

const shuffler = Shuffler();
shuffleProcess.forEach(process => {
  shuffler.applyTechnique(process);
});

console.log("answer part", shuffler.stack.indexOf(2019));
