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
};

yargsInteractive()
  .usage("$0 <command> [args]")
  .interactive(options)
  .then(({ projectName, collectionSize, tokenURI }) => {
    if (!isUrl(tokenURI)) {
      throw Error("Please enter a valid baseURI");
      return;
    }

    const PROJECT_NAME = projectName;
    const COLLECTION_SIZE = collectionSize;
    const BASE_URI = setHttp(tokenURI).replace(/\/$/, "");

    /**
     * No more than 10 parallel, spaced at least 100ms apart
     * These are typical fair-use limitations of public APIs
     **/
    const queue = new Queue(1000, 10);
    let p = [];
    let collection = [];

    console.clear();
    process.stdout.write("\x1B[?25l");

    async function download(i, baseUrl, PROJECT_NAME, queue) {
      /* Generate a queue ID */
      const uid = Symbol();
      await queue.wait(uid, 0);
      try {
        process.stdout.write(`Downloaded ${PROJECT_NAME} #${i}...\r`);
        const data = await fetch(`${baseUrl}/${i}`);
        const json = await data.json();

        json._uid = i;

        collection.push(json);
      } catch (e) {
        log(`Failed to scrape #${i} retrying at the end`);
        console.error(e);
        p.push(i, baseurl, PROJECT_NAME, queue); // queue to retry
      } finally {
        queue.end(uid);
      }
    }

    async function runParallel(baseUrl, totalSupply) {
      console.log("\nScraping Metadata...");
      console.log("This may take a while please be patient...😉");
      console.time("Total time taken");
      console.time("Done scraping");
      for (let i = 1; i <= totalSupply; i++) {
        /* Each iteration is an anonymous async function */
        p.push(download(i, baseUrl, PROJECT_NAME, queue));
      }

      await Promise.allSettled(p);
      // All downloads done!
      console.log("\n");
      console.timeEnd("Done scraping");
      console.log(`${collection.length} items scraped`);
      console.log("-------");

      fs.mkdir(`../scraped/${PROJECT_NAME}`, { recursive: true }, (err) => {
        if (err) throw err;
      });

      fs.writeFile(
        `../scraped/${PROJECT_NAME}/collection.json`,
        JSON.stringify(collection),
        (err) => {
          if (err) {
            console.log("Saving scraped collection failed\n", err);
          } else {
            console.log(
              `Collection successfully saved under "../scraped/${PROJECT_NAME}/collection".json`
            );
          }
        }
      );

      const rarity = JSON.stringify(getRarity(PROJECT_NAME, collection));

      fs.writeFile(`../scraped/${PROJECT_NAME}/rarity.json`, rarity, (err) => {
        if (err) {
          console.log("Saving rarity failed\n", err);
        } else {
          console.log(
            `Rarity successfully saved under "../scraped/${PROJECT_NAME}/collection.json"`
          );
        }
      });

      console.timeEnd("Total time taken");
      console.log("-------");
    }

    runParallel(BASE_URI, COLLECTION_SIZE);
  });
