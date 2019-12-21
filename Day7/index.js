const computer = () => require("../Computer").load("./Day7/input.txt");

function maxThrusterSignal(offset = 0, loop = false) {
  let thruster = 0;

  function amplifier(phase = 0) {
    let amplify = computer();
    amplify.setInput(phase);
    return (signal = 0) => {
      amplify.setInput(signal);
      amplify.run();
      return amplify.getLastOutput();
    };
  }

  for (let a = offset; a <= 4 + offset; a++) {
    for (let b = offset; b <= 4 + offset; b++) {
      for (let c = offset; c <= 4 + offset; c++) {
        for (let d = offset; d <= 4 + offset; d++) {
          for (let e = offset; e <= 4 + offset; e++) {
            if (
              a !== b &&
              a !== c &&
              a !== d &&
              a !== e &&
              b !== c &&
              b !== d &&
              b !== e &&
              c !== d &&
              c !== e &&
              d !== e
            ) {
              const A = amplifier(a);
              const B = amplifier(b);
              const C = amplifier(c);
              const D = amplifier(d);
              const E = amplifier(e);

              let run = (v = 0) => E(D(C(B(A(v)))));
              if (!loop) {
                thruster = Math.max(thruster, run(0));
                continue;
              } else {
                let last = 0;
                let it = 0;
                while (it < 10) {
                  last = run(last);
                  if (last === thruster) {
                    break;
                  }
                  thruster = Math.max(thruster, last);
                  it++;
                }
              }
            }
          }
        }
      }
    }
  }
  return thruster;
}

console.log("Answer part1:", maxThrusterSignal());

console.log("Answer part2:", maxThrusterSignal(5, true));
