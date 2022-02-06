// WARN: do not run this if you haven't scraped and calculate rarity
const fs = require("fs");
const process = require("process");
// const { PROJECT_NAME, COLLECTION_SIZE, BASE_URI } = require("./config.json");
const { sortMapDesc } = require("./utils/helpers");

const collection = require(`../scraped/HEAD5/collection.json`);
const { getRarity } = require("./getRarity");

// console.log(collection);
const rarity = JSON.stringify(getRarity("HEAD5", collection));

fs.writeFile(`../scraped/HEAD5/rarity.json`, rarity, (err) => {
  if (err) {
    console.log("Saving rarity failed\n", err);
  } else {
    console.log(
      `Rarity successfully saved under "../scraped/HEAD5/rarity.json"`
    );
  }
});
