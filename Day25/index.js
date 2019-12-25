const Computer = require('../Computer')

const createActions = (suffix, str) => str.split("\n").map(it => it.startsWith("-") ?
    it.substring(2) : undefined).filter(it => it).map(it => suffix + " " +
    it)


class Droid {

    constructor() {
        this.computer = Computer.load('./Day25/input.txt')
    }

    inventory() {
        this.execute("inv")
    }

    execute(command) {
        command.split("").forEach(i => this.computer.setInput(i.charCodeAt(0)))
        this.computer.setInput(10)
        this.run()
        console.log("Running comand", command)
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
        const inventoryIdx = lastOutput.includes("You aren't carrying any items") ? -1 :
            lastOutput.indexOf("Items in your inventory:")

        let actions = []
        if (doorsIdx > -1) {
            actions = actions.concat(createActions("move", lastOutput.substring(doorsIdx, lastOutput.indexOf("\n\n", doorsIdx))))
        }
        if (itemsIdx > -1) {
            actions = actions.concat(createActions("take", lastOutput.substring(itemsIdx + "Items here:".length, inventoryIdx)))
        }
        if (inventoryIdx > -1) {
            actions = actions.concat(createActions("drop", lastOutput.substring(inventoryIdx + "Items in your inventory:".length)))
        }
        return actions
    }

}

class TreeNode {
    predecessor = null

    action = null

    constructor(predecessor, action) {
        this.predecessor = predecessor;
        this.action = action;
    }
}

// const searchQueue = []
// let i = 0;
// predecessor = null;
// const droid = new Droid()
// while (i < 10) {
//     i++;
//     droid.inventory()
//     droid.getPossibleActions().map(action => new TreeNode(predecessor, action))
//         .forEach(node => searchQueue.push(node))
//     const last = searchQueue[searchQueue.length - 1]
//     let list = [last]
//     let next = last.predecessor
//     while (next != null) {
//         next = last.predecessor
//         if (next) {
//             list.push(next)
//         }
//         console.log("i")
//     }
//     list.reverse().forEach(node => droid.execute(node.action))
//     predecessor = last
// }



module.exports = Droid