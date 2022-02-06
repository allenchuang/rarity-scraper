const { showLogs } = require("../config.json");

function log(msg) {
  return showLogs ? console.log(msg) : null;
}

function time(name) {
  return showLogs ? console.time(name) : null;
}

function timeEnd(name) {
  return showLogs ? console.timeEnd(name) : null;
}

function setHttp(link) {
  if (link.search(/^http[s]?\:\/\//) == -1) {
    link = "http://" + link;
  }
  return link;
}

function isUrl(s) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

function sortMapDesc(map) {
  return Object.entries(map).sort((a, b) => {
    return b[1].score - a[1].score;
  });
}

function sortMapAsc(map) {
  return Object.entries(map)
    .sort(([, a], [, b]) => a.score - b.score)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

function roundTo(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}


function isMetadataValid(data, sampleData) {
  let isValid = false;

  // console.log({ data, sampleData })
  if (data.image !== sampleData.image) {
    isValid = true;
  } else if (Object.keys(data).length !== Object.keys(data).length) {
    isValid = true;
  } else if (data.attributes && sampleData.attributes && data.attributes.length > sampleData?.attributes?.length) {
    isValid = true;
  }

  return isValid;
}

module.exports = {
  log,
  time,
  timeEnd,
  setHttp,
  isUrl,
  sortMapAsc,
  sortMapDesc,
  roundTo,
  isMetadataValid
};
