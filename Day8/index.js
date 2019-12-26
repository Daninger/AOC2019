const INPUT = require("fs")
    .readFileSync("./Day8/input.txt")
    .toString();

function parseImage(image = "123456789012", width = 3, height = 2) {
    let layers = [];
    let i = 0;
    while (i < image.length / (width * height)) {
        layers[i] = image.substring(i * width * height, (i + 1) * width * height);
        i++;
    }
    return layers;
}

function countNumber(number) {
    return str => str.split("").filter(it => it == number).length;
}
const countZeros = countNumber(0);
const countOnes = countNumber(1);
const countTwos = countNumber(2);

function corruptionCheck(input, width, height) {
    const layers = parseImage(input, width, height);
    const maxZeros = layers.sort((a, b) => countZeros(a) - countZeros(b))[0];
    return countOnes(maxZeros) * countTwos(maxZeros);
}

console.log(corruptionCheck(INPUT, 25, 6));

// PART 2

function finalImage(INPUT = "0222112222120000", width = 2, height = 2) {
    const layers = parseImage(INPUT, width, height);
    const image = [];
    for (const layer of layers) {
        const data = layer.split("").map(Number);
        for (let i = 0; i < data.length; i++) {
            image[i] =
                image[i] != null ? image[i] : data[i] !== 2 ? data[i] : undefined;
        }
    }
    return image.join("");
}

function prettyPrintImage(image, width, height) {
    for (let h = 0; h < height; h++) {
        console.log(
            image
            .substring(h * width, (h + 1) * width)
            .replace(/0/g, " ")
            .replace(/1/g, "*")
        );
    }
}

prettyPrintImage(finalImage(INPUT, 25, 6), 25, 6);