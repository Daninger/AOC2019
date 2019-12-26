const Computer = require('../Computer')

const createActions = (suffix, str) => str.split("\n").map(it => it.startsWith("-") ?
    it.substring(2) : undefined).filter(it => it).map(it => suffix +
    it)


module.exports = class Droid {

    blackListActions = ['take molten lava', 'take infinite loop', 'take escape pod']

    constructor() {
        this.computer = Computer.load('./Day25/input.txt')
        this.inventory()
    }

    inventory() {
        this.execute("inv")
        const lastOutput = this.getLastOutput()
        const inventoryIdx = lastOutput.includes("You aren't carrying any items") ? -1 :
            lastOutput.indexOf("Items in your inventory:")

        if (inventoryIdx > -1) {
            return createActions("", lastOutput.substring(inventoryIdx, lastOutput.indexOf("\n\n", inventoryIdx)))
        }
        return []
    }

    getRoom() {
        const out = this.getLastOutput()
        return out.substring(out.indexOf("=") + 1, out.indexOf("\n\n", out.indexOf("=") + 1) - 1)
    }

    execute(command) {
        command.split("").forEach(i => this.computer.setInput(i.charCodeAt(0)))
        this.computer.setInput(10)
        this.run()
    }

    run() {
        this.computer.run()
    }

    get output() {
        return this.computer.output.map(i => String.fromCharCode(i)).join("")
    }


    move(direction = "south") {
        this.execute(direction)
    }

    take(item) {
        this.execute("take " + item)
    }

    drop(item) {
        this.execute("drop " + item)
    }

    getLastOutput() {
        const start = this.output.lastIndexOf("=")
        if (start > -1) {
            return this.output.slice(start)
        }
    }

    getPossibleActions() {
        const lastOutput = this.getLastOutput()
        const doorsIdx = lastOutput.indexOf("Doors here lead:")
        const itemsIdx = lastOutput.indexOf("Items here:")

        let move = []
        let take = []
        if (itemsIdx > -1) {
            take = createActions("take ", lastOutput.substring(itemsIdx, lastOutput.indexOf("\n\n", itemsIdx)))
                .filter(it => !this.blackListActions.includes(it))
        }
        if (doorsIdx > -1) {
            move = createActions("", lastOutput.substring(doorsIdx, lastOutput.indexOf("\n\n", doorsIdx)))
        }
        return { move, take }
    }

}