const Droid = require('./index.js')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const droid = new Droid()
droid.inventory()


function command() {
    readline.question(droid.getLastOutput() + `\nCommand?`, (name) => {
        if (name === "q" || name === "quit") {
            readline.close()
            process.exit(1)
        }
        if (name === "w" || name === "north") {
            name = "north"
        } else if (name === "s" || name === "south") {
            name = "south"
        } else if (name === "a" || name === "east") {
            name = "east"
        } else if (name === "d" || name === "west") {
            name = "west"
        }
        droid.execute(name.replace(/_/g, " "))
        command()
    })
}
command()



/*
//Items here:
- wreath
- coin
- dehydrated water
- asterisk
- monolith
- astrolabe
- mutex
*/