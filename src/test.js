// WARN: do not run this if you haven't scraped and calculate rarity

// const { PROJECT_NAME, COLLECTION_SIZE, BASE_URI } = require("./config.json");
const { sortMapDesc } = require("./utils/helpers");

const collection = require(`../scraped/CryptoBatz/collection.json`);
const rarity = require(`../scraped/CryptoBatz/rarity.json`);

console.log(rarity.rarity.length);
