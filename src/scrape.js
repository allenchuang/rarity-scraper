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
  startingIndex: {
    type: "input",
    default: CONFIG.STARTING_INDEX,
    describe: "Enter start index",
  },
};

yargsInteractive()
  .usage("$0 <command> [args]")
  .interactive(options)
  .then(
    async ({ projectName, collectionSize, tokenURI, startingIndex = 1 }) => {
      console.time("Total time taken");
      if (!isUrl(tokenURI)) {
        throw Error("Please enter a valid baseURI");
        return;
      }

      const PROJECT_NAME = projectName;
      const COLLECTION_SIZE = collectionSize;
      const BASE_URI = setHttp(tokenURI).replace(/\/$/, "");
      const STARTING_INDEX = startingIndex;

      console.clear();
      process.stdout.write("\x1B[?25l");

      // scrape files
      const collection = await runParallel(
        PROJECT_NAME,
        BASE_URI,
        STARTING_INDEX,
        COLLECTION_SIZE
      );

      // get rarity
      const rarity = getRarity(projectName, collection);

      console.timeEnd("Total time taken");
      console.log("-------");
    }
  );
