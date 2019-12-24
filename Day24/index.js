class Eris {
    tiles = []

    history = new Set()

    constructor(input = `....#
#..#.
#..##
..#..
#....`) {
        const matrix = input.split("\n").map(it => it.split(""))
        this.size = [matrix.length, matrix[0].length]
        matrix.forEach((l, i) => l.forEach((it, j) => this.tiles.push(new Tile(i, j,
            (i * this.size[0]) + j,
            it === "#"))))
        for (let tile of this.tiles) {
            for (let other of this.tiles) {
                if ((Math.abs(other.i - tile.i) || Math.abs(other.j - tile.j) === 1) &&
                    Math.abs(other.i - tile.i) + Math.abs(other.j - tile.j) <= 1
                ) {
                    tile.adjacents.push(other)
                }
            }
        }
    }

    evolve() {
        this.tiles.forEach(it => it.calulateBugInfection())
        this.tiles.forEach(it => it.update())
        const state = this.totalBiodiversity
        if (this.history.has(state)) {
            return true
        }
        this.history.add(state)
    }

    print() {
        let out = ""
        const [N, M] = this.size
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < M; j++) {
                out += this.tiles.find(it => it.i === i && it.j === j).toString()
            }
            out += "\n"
        }
        console.log(out)
    }

    get totalBiodiversity() {
        return this.tiles.filter(it => it.bug).reduce((acc, next) => {
            acc += next.biodiversity
            return acc
        }, 0)
    }
}



class Tile {
    willBeInfested = undefined
    adjacents = []

    constructor(i, j, number, bug) {
        this.bug = bug
        this.number = number
        this.i = i;
        this.j = j;
    }

    calulateBugInfection() {
        const adjacentBugs = this.adjacents.filter(it => it.bug).length
        if (this.bug) {
            this.willBeInfested = adjacentBugs === 1
        } else {
            this.willBeInfested = adjacentBugs >= 1 && adjacentBugs <= 2
        }
    }

    update() {
        this.bug = this.willBeInfested
    }

    toString() {
        return this.bug ? '#' : '.'
    }

    get biodiversity() {
        return this.bug ? Math.pow(2, this.number) : 0
    }

}

const eris = new Eris(require("fs").readFileSync("./Day24/input.txt").toString())
for (let it = 0; it < 100; it++) {
    if (eris.evolve()) {
        eris.print()
        break;
    }
}

console.log("Answer to part1:", eris.totalBiodiversity)