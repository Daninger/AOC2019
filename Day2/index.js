const SAMPLE_PROGRAM = require("fs")
    .readFileSync("./Day2/input.txt")
    .toString()
    .split(",")
    .map(s => Number(s));

SAMPLE_PROGRAM[1] = 12;
SAMPLE_PROGRAM[2] = 2;

function intCodeComputer(program = [1, 0, 0, 3, 99]) {
    let index = 0;
    while (index < program.length) {
        switch (program[index]) {
            case 1:
                program = opcode1(index, program);
                break;
            case 2:
                program = opcode2(index, program);
                break;
            case 99:
                return program;
        }
        index += 4;
    }
}

function opcode(operation) {
    return (index, program) => {
        const result = operation(
            program[program[index + 1]],
            program[program[index + 2]]
        );
        program[program[index + 3]] = result;
        return program;
    };
}
const opcode1 = opcode((a, b) => a + b);
const opcode2 = opcode((a, b) => a * b);

const dataPart1 = SAMPLE_PROGRAM.slice();
dataPart1[1] = 12;
dataPart1[2] = 2;
console.log(intCodeComputer(dataPart1)[0]);

// ---------------
// PART 2:
// ---------------

function findNounAndVerb(program, result) {
    for (let i = 0; i <= 99; i++) {
        for (let j = 0; j <= 99; j++) {
            const sequence = program.slice();
            sequence[1] = i;
            sequence[2] = j;
            if (intCodeComputer(sequence)[0] === result) {
                return { noun: i, verb: j };
            }
        }
    }
    console.log(a);
}

console.log(findNounAndVerb(SAMPLE_PROGRAM, 19690720));