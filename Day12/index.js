// my input
const IO = Moon([5, 4, 4]);
const Europa = Moon([-11, -11, -3]);
const Ganymede = Moon([0, 7, 0]);
const Callisto = Moon([-13, 2, 10]);

// example
// const IO = Moon([-1, 0, 2]);
// const Europa = Moon([2, -10, -7]);
// const Ganymede = Moon([4, -8, 8]);
// const Callisto = Moon([3, 5, -1]);

// const IO = Moon([-8, -10, 0]);
// const Europa = Moon([5, 5, 10]);
// const Ganymede = Moon([2, 7, 3]);
// const Callisto = Moon([9, -8, -3]);

// const IO = Moon([14, 2, 8]);
// const Europa = Moon([7, 4, 10]);
// const Ganymede = Moon([1, 17, 16]);
// const Callisto = Moon([-4, -1, 1]);

const MOONS = Object.entries({ IO, Europa, Ganymede, Callisto });

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

function Moon(initialPosition = [0, 0, 0]) {
  return {
    pos: initialPosition,
    vel: [0, 0, 0],
    get fingerprint() {
      return this.pos.join(",") + ":" + this.vel.join(",");
    },
    move() {
      this.pos = add(this.pos, this.vel);
      return this;
    },
    applyGravity({ pos: otherPos }) {
      this.pos.forEach((p, i) => {
        if (p < otherPos[i]) {
          this.vel[i]++;
        } else if (p > otherPos[i]) {
          this.vel[i]--;
        }
      });
      return this;
    },
    energy() {
      const norm = v =>
        v.reduce((acc, p) => {
          acc += Math.abs(p);
          return acc;
        }, 0);
      const potential = norm(this.pos);
      const kinetic = norm(this.vel);
      return potential * kinetic;
    }
  };
}

function step(moons = MOONS) {
  for (let [name, moon] of moons) {
    for (let [otherName, other] of moons) {
      if (name !== otherName) {
        moon.applyGravity(other);
      }
    }
  }
  for (let [_, moon] of moons) {
    moon.move();
  }
}

function totalEnergyAfter1000Steps(moons = MOONS) {
  for (let step = 0; step < 1; step++) {
    step(moons);
  }
  return currentSystemEnergy();
}

function currentSystemEnergy() {
  return IO.energy() + Europa.energy() + Ganymede.energy() + Callisto.energy();
}

// console.log("Total energy", IO, totalEnergyAfter1000Steps()); // -> 10845

// PART 2:

function determineStepWithSameFingerprint(moons = MOONS) {
  const ds0 = moons.map(([_, it]) => it.fingerprint);
  console.log(ds0);
  let i = 0;
  let cycle = [];
  let found = 0;

  while (found < 3) {
    step();
    i++;
    if (i % 1000000 === 0) {
      console.log(i, cycle.length);
      console.log(moons.map(([_, it]) => it.fingerprint));
    }
    for (let j = 0; j < 3; j++) {
      let ds = moons[j][1].fingerprint;
      if (ds === undefined) {
        console.log("Oops");
      }
      if (ds === ds0[j]) {
        console.log("found cycle for " + j + " = " + i);
        cycle[j] = i;
        found++;
        ds0[j] = ""; //clear
      }
    }
  }

  return lowestCommonMultiplier(cycle);
}

function lowestCommonMultiplier(list) {
  if (list.length === 2) {
    return lcm(list[0], list[1]);
  } else {
    let lcds = [];
    for (let i = 0; i <= list.length - 2; i++) {
      lcds.push(lcm(list[i], list[i + 1]));
    }
    return lowestCommonMultiplier(lcds);
  }
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

console.log(determineStepWithSameFingerprint());

// console.log(
//   "Total energy",
//   IO.energy() + Europa.energy() + Ganymede.energy() + Callisto.energy()
// );
