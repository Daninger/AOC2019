const Droid = require('./droid')

class TreeNode {

    predecessor = null

    action = null

    inventory = []

    constructor(predecessor, action, room, inventory = []) {
        this.predecessor = predecessor;
        this.action = action;
        this.inventory = inventory
        this.room = room
    }
    get id() {
        return JSON.stringify({ action: this.action, inventory: this.inventory, room: this.room })
    }
}

function collectAllItemsAndBringToPressureSensitiveRoom() {
    let searchQueue = []
    let visited = new Set()
    let rooms = new Set()

    const root = new Droid()
    root.getPossibleActions().move.map((action) => new TreeNode(null, action, root.getRoom()))
        .forEach(node => searchQueue.push(node))

    function getActionList(node) {
        let list = [node]
        let next = node.predecessor
        while (next != null) {
            list.push(next)
            next = next.predecessor
        }
        return list.reverse()
    }

    while (searchQueue.length) {
        const droid = new Droid()
        const nextNode = searchQueue[0]
        if (nextNode.inventory.length === 7 && nextNode.room.includes("pressure-sensitive floor")) {
            console.log("Found all items!")
            return getActionList(nextNode).map(it => it.action)
        }
        searchQueue = searchQueue.slice(1)
        let lastActions = getActionList(nextNode)

        lastActions.forEach(node => droid.execute(node.action))

        const { move, take } = droid.getPossibleActions()
        let takeNode = null
        if (take.length > 0) {
            takeNode = new TreeNode(nextNode, take[0], droid.getRoom(), droid.inventory())
        }
        for (let moveAction of move) {
            const node = new TreeNode(takeNode || nextNode, moveAction, droid.getRoom(), droid.inventory())
            if (!visited.has(node.id)) {
                searchQueue.push(node)
                visited.add(node.id)
                rooms.add(droid.getRoom())
            }
        }
    }
}

function tryAllItemCombinations(actionsToLastRoom = ['south', 'take monolith', 'east', 'take asterisk', 'west', 'north', 'west', 'take coin', 'east', 'north', 'north', 'take mutex', 'west', 'take astrolabe', 'west', 'take dehydrated water', 'west', 'take wreath', 'east', 'south', 'east', 'north', 'north']) {

    const droid = new Droid()
    actionsToLastRoom.forEach(a => droid.execute(a))
    const inventory = droid.inventory()

    getAllItemCombinations().forEach(comb => {
        for (let i = 0; i <= 6; i++) {
            if (comb[i] === 0) {
                droid.drop(inventory[i])
            }
        }
        droid.move("north")
        if (droid.getLastOutput().includes("pressure-sensitiv")) {
            inventory.forEach(item => droid.take(item))
        } else {
            console.log(droid.getLastOutput())
            return
        }
    })
}

function getAllItemCombinations() {
    let result = []
    for (let a = 0; a <= 1; a++) {
        for (let b = 0; b <= 1; b++) {
            for (let c = 0; c <= 1; c++) {
                for (let d = 0; d <= 1; d++) {
                    for (let e = 0; e <= 1; e++) {
                        for (let f = 0; f <= 1; f++) {
                            for (let g = 0; g <= 1; g++) {
                                result.push([a, b, c, d, e, f, g])
                            }
                        }
                    }
                }
            }
        }
    }
    return result
}

module.exports = () => tryAllItemCombinations(collectAllItemsAndBringToPressureSensitiveRoom())