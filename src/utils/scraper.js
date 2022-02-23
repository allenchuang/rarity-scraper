const fs = require("fs");
const process = require("process");
const rdl = require("readline");
const fetch = require("node-fetch");
const Queue = require("async-await-queue");
const CONFIG = require("../config.json");
const { setHttp, isUrl, log, time, timeEnd } = require("./helpers");
const { getRarity } = require("../getRarity");

async function download(i, baseUrl, jsonSuffix, projectName, queue, collection) {
  /* Generate a queue ID */
  const uid = Symbol();
  await queue.wait(uid, 0);
  try {
    process.stdout.write(`Downloaded ${projectName} #${i}...\r`);
    // console.log({ baseUrl, i, jsonSuffix })
    const data = await fetch(`${baseUrl}/${i}${jsonSuffix ? '.json' : ''}`);
    const json = await data.json();

    console.log({ json });
    if (!json.attributes) {
      throw Error("no attributes");
      return;
    }

    json._uid = i;

    collection.push(json);
  } catch (e) {
    log(`Failed to scrape #${i} retrying at the end`);
    console.error(e);
    p.push(i, baseurl, projectName, queue); // queue to retry
  } finally {
    queue.end(uid);
  }
}

async function runParallel(projectName, baseUrl, jsonSuffix, startIndex, endIndex, totalSupply) {
  /**
   * No more than 10 parallel, spaced at least 100ms apart
   * These are typical fair-use limitations of public APIs
   **/
  const queue = new Queue(10, 100);
  let p = [];
  let collection = [];

  console.log("\nScraping Metadata...");
  console.log("This may take a while please be patient...😉");
  console.time("Done scraping");

  // const endIndex = startIndex === 0 ? totalSupply - 1 : totalSupply;
  for (let i = startIndex; i <= endIndex; i++) {
    /* Each iteration is an anonymous async function */
    p.push(download(i, baseUrl, jsonSuffix, projectName, queue, collection));
  }

  await Promise.allSettled(p);

  // All downloads done!
  console.log("\n");
  console.timeEnd("Done scraping");
  console.log(`${collection.length} items scraped`);
  console.log("-------");

  fs.mkdir(`../scraped/${projectName}`, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.writeFile(
    `../scraped/${projectName}/collection.json`,
    JSON.stringify(collection),
    (err) => {
      if (err) {
        console.log("Saving scraped collection failed\n", err);
      } else {
        console.log(
          `Collection successfully saved under "../scraped/${projectName}/collection".json`
        );
      }
    }
  );

  return collection;
}

module.exports = {
  download,
  runParallel,
};
