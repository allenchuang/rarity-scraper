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
// // sort by value
// const sortMapDesc = new Map([...myMap.entries()].sort((a, b) => b[1] - a[1]));
// console.log(mapSort1);
// // Map(4) {"c" => 4, "a" => 3, "d" => 2, "b" => 1}

// const sortMapAsc = new Map([...myMap.entries()].sort((a, b) => a[1] - b[1]));
// console.log(mapSort2);
// // Map(4) {"b" => 1, "d" => 2, "a" => 3, "c" => 4}

// // sort by key
// const sortMapAsc = new Map([...myMap.entries()].sort());
// console.log(mapSort3);
// // Map(4) {"a" => 3, "b" => 1, "c" => 4, "d" => 2}

// const mapSort4 = new Map([...myMap.entries()].reverse());
// console.log(mapSort4);
// // Map(4) {"d" => 2, "b" => 1, "c" => 4, "a" => 3}

module.exports = {
  log,
  time,
  timeEnd,
  setHttp,
  isUrl,
  sortMapAsc,
  sortMapDesc,
  roundTo,
};
