const CONFIG = require("./config.json");
const fetch = require("node-fetch");
const { isMetadataValid, setHttp } = require("./utils/helpers");
const sampleData = require("./sampleMetadata.json")
const { getRarity } = require("./getRarity");
const { runParallel } = require("./utils/scraper");

const ping = setInterval(async () => {
  const PROJECT_NAME = CONFIG.PROJECT_NAME;
  const COLLECTION_SIZE = CONFIG.COLLECTION_SIZE;
  const BASE_URI = setHttp(CONFIG.BASE_URI).replace(/\/$/, "");
  const STARTING_INDEX = CONFIG.STARTING_INDEX;

  try {
    const res = await fetch(`${BASE_URI}/12`);
    const json = await res.json();

    // check if metaData is valid
    if (isMetadataValid(json, sampleData)) {
      console.log("PROJECT REVEALED!\n\n");
      clearInterval(ping);
      // scrape files
      const collection = await runParallel(
        PROJECT_NAME,
        BASE_URI,
        STARTING_INDEX,
        COLLECTION_SIZE
      );

      // get rarity
      const rarity = getRarity(PROJECT_NAME, collection);
    } else {
      throw Error("metadata not updated yet")
    }

  } catch (e) {
    console.log("error", e);
  }
}, 1000);