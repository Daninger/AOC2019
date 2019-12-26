const SAMPLE_LINES = require("fs")
    .readFileSync("./Day3/input.txt")
    .toString()
    .split("\n");

function closestIntersection(
    lineA = "R75,D30,R83,U83,L12,D49,R71,U7,L72",
    lineB = "U62,R66,U55,R34,D71,R55,D58,R83"
) {
    const intersection = intersect(run(lineA), run(lineB));
    const sortByManhattenDistance = (a, b) =>
        manhattenDistance(a) - manhattenDistance(b);
    const manhattenDistance = point => Math.abs(point[0]) + Math.abs(point[1]);
    const sorted = intersection.sort(sortByManhattenDistance);
    return manhattenDistance(sorted[0]);
}

function intersect(a = [], b = []) {
    const result = [];
    for (el of a) {
        if (el[0] === 0 && el[1] === 0) {
            continue;
        }
        const other = b.find(it => it[0] === el[0] && it[1] === el[1]);
        if (other) {
            const p = el.slice();
            p[2] = el[2] + other[2];
            result.push(p);
        }
    }
    return result;
}

function run(line) {
    let visitedPoints = [];
    let lastPoint = [0, 0, 0];
    for (segment of line.split(",")) {
        const direction = segment.charAt(0);
        const distance = Number(segment.substring(1));
        visitedPoints = visitedPoints.concat(move(direction)(lastPoint, distance));
        lastPoint = visitedPoints[visitedPoints.length - 1];
    }
    return visitedPoints;
}

function move(direction) {
    return (start, distance) => {
        const path = [];
        for (let i = 0; i <= distance; i++) {
            const dx = direction === "R" ? i : direction === "L" ? -i : 0;
            const dy = direction === "U" ? i : direction === "D" ? -i : 0;
            const dz = i;
            path.push([start[0] + dx, start[1] + dy, start[2] + dz]);
        }
        return path;
    };
}

console.log(closestIntersection(SAMPLE_LINES[0], SAMPLE_LINES[1]));

// ---------------
// PART 2:
// ---------------
function shortestPathToAnIntersection(
    lineA = "R75,D30,R83,U83,L12,D49,R71,U7,L72",
    lineB = "U62,R66,U55,R34,D71,R55,D58,R83"
) {
    const intersections = intersect(run(lineA), run(lineB));
    const sortByShortestDistance = (a, b) => a[2] - b[2];
    const sorted = intersections.sort(sortByShortestDistance);
    return sorted[0];
}

console.log(shortestPathToAnIntersection(SAMPLE_LINES[0], SAMPLE_LINES[1]));