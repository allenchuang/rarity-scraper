const { log, time, timeEnd, sortMapDesc, roundTo } = require("./utils/helpers");

function tallyTraits(collection) {
  console.log("Tallying traits....");
  console.time("Done tallying traits");
  const traitsMap = {};
  for (item of collection) {
    const itemAttributes = item.attributes;
    for (trait of itemAttributes) {
      const traitType = trait.trait_type;
      const traitValue = trait.value;
      const traitKey = `${traitType}:${traitValue}`;
      if (!traitsMap[traitKey]) {
        traitsMap[traitKey] = 0;
      }
      traitsMap[traitKey] = traitsMap[traitKey] + 1;
    }
  }
  const sortedTraitsList = Object.entries(traitsMap).sort(
    (a, b) => a[1] - b[1]
  );

  console.timeEnd("Done tallying traits");
  console.log("-------");
  log(sortedTraitsList);
  return { sortedTraitsList, traitsMap };
}

function calcRarity(projectName, collection, traitsMap) {
  console.log("Calculating rarity...");
  console.time("Done calculating rarity");
  const rarityMap = {};
  // log({ collection });
  for (item of collection) {
    // log({ item });
    const itemId = item._uid;
    const itemAttributes = item.attributes;
    log(`Calculating rarity for ${projectName} #${itemId}...`);
    // loop through each trait and calc rarity for each trait
    let itemRarityScore = 0;
    for (trait of itemAttributes) {
      const traitType = trait.trait_type;
      const traitValue = trait.value;
      const traitKey = `${traitType}:${traitValue}`;

      const totalTraitKey = traitsMap[traitKey];
      const totalSupply = collection.length;

      const traitRarityPercentage = totalTraitKey / totalSupply;
      const traitRarityScore = roundTo(1 / traitRarityPercentage, 2);

      log(
        `${traitType}:${traitValue} - ${
          traitRarityPercentage * 100
        } / score: ${traitRarityScore}`
      );

      // add to total item score
      itemRarityScore += traitRarityScore;
    }
    // update mapping
    rarityMap[itemId] = { score: itemRarityScore };
    log("---");
    log(`TotalScore: ${itemRarityScore}`);
    log("-------------------------");
  }

  const sorted = sortMapDesc(rarityMap);
  const top30 = sorted.slice(0, 30);
  log(sorted);

  console.timeEnd("Done calculating rarity");
  console.log("\nTop 30 Rarest:\n");
  console.log(top30.map(([i, { score }]) => `#${i} : ${score} `).join("\n"));
  return sorted;
}

function getTopRarity(rarityMap, percent) {
  const topRarity = [...rarityMap];

  topRarity.length = Math.floor((totalSupply * percent) / 100);
  return topRarity;
}

function getRarity(projectName, collection) {
  const { traitsMap, sortedTraitsList } = tallyTraits(collection);
  const rarity = calcRarity(projectName, collection, traitsMap);

  // const top20 = getTopRarity(rarity, 20);
  return {
    sortedTraitsList,
    rarity,
    // top20,
  };
}

module.exports = {
  tallyTraits,
  calcRarity,
  getRarity,
};
