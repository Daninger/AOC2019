const ASTEROIDS = require("fs")
    .readFileSync("./Day10/input.txt")
    .toString();

function readAsteroidMap(
    input = `.#..#
.....
#####
....#
...##`
) {
    return input.split("\n").reduce((acc, line, y_index) => {
        line
            .split("")
            .forEach((val, x_index) => val === "#" && acc.push([x_index, y_index]));
        return acc;
    }, []);
}

console.log(readAsteroidMap());

function findBestStationLocation(input) {
    const asteroids = readAsteroidMap(input);
    for (const possibleStation of asteroids) {
        markAllAsteroidsInSight(possibleStation, asteroids);
    }
    asteroids.sort((a, b) => b[2] - a[2]);
    return asteroids[0];
}

function markAllAsteroidsInSight(station, asteroids) {
    for (const a of asteroids) {
        if (!equal(a, station)) {
            if (!isBlocked(station, a, asteroids)) {
                station[2] = (station[2] || 0) + 1;
            }
        }
    }
}

function isBlocked(station, asteroid, asteroids) {
    for (const a of asteroids) {
        if (!equal(station, a) && !equal(asteroid, a)) {
            if (isOnSegment(station, asteroid, a)) {
                return true;
            }
        }
    }
    return false;
}

function diff(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}

function equal(a, b) {
    return a[0] === b[0] && a[1] === b[1];
}

function isOnSegment(a = [0, 0], b = [2, 2], p = [1, 1]) {
    //is there a k in [0,1] with: a + kb = p;
    const v = diff(p, a);
    const d = diff(b, a);
    const k = d[0] ? v[0] / d[0] : d[1] ? v[1] / d[1] : false;
    if (k === false) {
        return equal(a, p);
    }
    if (d[0] * k !== v[0] || d[1] * k !== v[1]) {
        return false;
    }
    return k >= 0 && k <= 1;
}

console.log(findBestStationLocation(ASTEROIDS)); //22,25,286

// PARTS

const norm = a => Math.sqrt(a[0] * a[0] + a[1] * a[1]);
const arc = (a, b) => {
    const radians = Math.acos((a[0] * b[0] + a[1] * b[1]) / (norm(a) * norm(b)));
    const degree = radians * (180 / Math.PI);
    if (b[0] < a[0]) {
        return 180 + degree;
    }
    return degree;
};

function runLazer(station, asteroids) {
    for (const a of asteroids) {
        a[2] = undefined;
        if (!equal(a, station)) {
            if (!isBlocked(station, a, asteroids)) {
                const v = diff(a, station);
                a[2] = arc([0, -1], v);
            }
        }
    }
    return asteroids.filter(v => v[2] != undefined).sort((a, b) => a[2] - b[2]);
}

function vaporizeAsteroids(station, input) {
    let asteroids = readAsteroidMap(input).filter(v => !equal(v, station));
    let remaining = asteroids;
    let vaporized = [];
    while (remaining.length > 0) {
        const vaporizedInOrder = runLazer(station, remaining);
        vaporized = vaporized.concat(vaporizedInOrder);
        remaining = remaining.filter(v => !vaporized.some(a => equal(a, v)));
    }
    return vaporized;
}


// TODO: we have a bug in second vaporization round somewhere
console.log(vaporizeAsteroids([22, 25], ASTEROIDS));