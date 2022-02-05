// WARN: do not run this if you haven't scraped and calculate rarity

const process = require("process");
// const { PROJECT_NAME, COLLECTION_SIZE, BASE_URI } = require("./config.json");
const { sortMapDesc } = require("./utils/helpers");

const collection = require(`../scraped/CryptoBatz/collection.json`);
const rarity = require(`../scraped/CryptoBatz/rarity.json`);

console.log(rarity.rarity.length);

process.stdout.write("\x1B[?25l");
process.stdout.write("[");
for (let i = 0; i < 50; i++) {
  process.stdout.write("-");
}
process.stdout.write("]");
