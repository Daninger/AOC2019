const createComputer = () =>
    require('../Computer').load("./Day23/input.txt")



const network = [...new Array(50)].map((_, ip) => {
    const computer = createComputer()
    console.log(ip)
    computer.setInput(ip)
    return computer
})

let inputQueue = {} // {42: [{X:1,Y:2}, {X:4,Y:6}]}
let outputQueue = {}

const getNextInput = (ip) => {
    const inputs = inputQueue[ip]
    if (inputs == null || inputs.length === 0) {
        return;
    } else {
        const next = inputs[0]
        inputQueue[ip] = inputs.slice(1)
        return next;
    }
}

const getNextOutput = (ip) => {
    const outIdx = outputQueue[ip] || 0
    const output = network[ip].output
    if (output.length < 3) {
        return []
    }
    const next = output.slice(outIdx, outIdx + 3)
    if (next.length !== 3) {
        return []
    }
    outputQueue[ip] = outIdx + 3;
    return next
}

const send = (ip) => {
    const [oip, X, Y] = getNextOutput(ip)
    if (oip != null) {
        if (!inputQueue[ip]) {
            inputQueue[ip] = []
        }
        inputQueue[ip].push({ X, Y })
    }
    if (oip === 255) {
        console.log("Send to 255", X, Y)
        return true
    }
}

const receive = (ip) => {
    let comp = network[ip]
    const input = getNextInput(ip)
        // process input packets
    if (!input) {
        comp.setInput(-1)
    } else {
        comp.setInput(input.X)
        comp.setInput(input.Y)
    }
}


function run() {
    for (let ip = 0; ip < network.length; ip++) {
        if (send(ip)) {
            return true
        }
        receive(ip)
        network[ip].run()

    }
}

let i = 0;
while (i < 100) {
    if (run()) {
        break
    }
    i++
}

console.log("Input", inputQueue)
console.log("Output", outputQueue)