#!/usr/bin/env node

const fs = require("fs");
const process = require("process");
const rdl = require("readline");
const fetch = require("node-fetch");
const Queue = require("async-await-queue");
const CONFIG = require("./config.json");
const yargsInteractive = require("yargs-interactive");
const { setHttp, isUrl, log, time, timeEnd } = require("./utils/helpers");
const { getRarity } = require("./getRarity");
const { runParallel } = require("./utils/scraper");

const options = {
  // comment out interactive if you don't want interactive mode
  // and uncomment defaults below and edit directly in config.json
  // interactive: { default: true },
  projectName: {
    type: "input",
    default: CONFIG.PROJECT_NAME,
    describe: "Enter project name",
  },
  collectionSize: {
    type: "input",
    default: CONFIG.COLLECTION_SIZE,
    describe: "Enter total supply",
  },
  tokenURI: {
    type: "input",
    default: CONFIG.BASE_URI,
    describe: "Enter baseURI address",
  },
  startIndex: {
    type: "input",
    default: CONFIG.START_INDEX,
    describe: "Enter start index",
  },
  endIndex: {
    type: "input",
    default: CONFIG.END_INDEX,
    describe: "Enter start index",
  },
  hasJsonPrefix: {
    type: "option",
    default: CONFIG.JSON_SUFFIX,
    describe: "Has JSON?",
  },
};

yargsInteractive()
  .usage("$0 <command> [args]")
  .interactive(options)
  .then(
    async ({ projectName, collectionSize, tokenURI, startIndex = 1, endIndex = 1 }) => {
      console.time("Total time taken");
      if (!isUrl(tokenURI)) {
        throw Error("Please enter a valid baseURI");
        return;
      }

      const PROJECT_NAME = projectName;
      const COLLECTION_SIZE = collectionSize;
      const BASE_URI = setHttp(tokenURI).replace(/\/$/, "");
      const START_INDEX = startIndex;
      const END_INDEX = endIndex;

      console.clear();
      process.stdout.write("\x1B[?25l");

      // scrape files
      const collection = await runParallel(
        PROJECT_NAME,
        BASE_URI,
        // JSON_SUFFIX,
        START_INDEX,
        COLLECTION_SIZE
      );

      // get rarity
      const rarity = getRarity(projectName, collection);

      console.timeEnd("Total time taken");
      console.log("-------");
    }
  );
