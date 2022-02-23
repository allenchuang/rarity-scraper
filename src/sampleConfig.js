// {
//   "PROJECT_NAME": "CryptoBatz",
//   "COLLECTION_SIZE": 9666,
//   "BASE_URI": "https://bafybeiejgckbr7xltffsbb2mppe5fwbwxsbjgl4qgde6bwjcmjladsg4ze.ipfs.dweb.link/",
//   "showLogs": false
// }

// {
//   "PROJECT_NAME": "ALPACADABRAZ",
//   "COLLECTION_SIZE": 9669,
//   "BASE_URI": "https://bafybeifbdszmnuh336pwzs3dqzpuvq3itd7ts3sfam57weqpeakkatwtum.ipfs.dweb.link/",
//   "showLogs": false
// }

// {
//   "PROJECT_NAME": "Beepos",
//     "COLLECTION_SIZE": 10,
//       "BASE_URI": "https://beepos.fun/api/beepos/",
//         "START_INDEX": 1,
//           "showLogs": false
// }

// {
//   "PROJECT_NAME": "Wall Street Chads",
//   "COLLECTION_SIZE": 3333,
//   "BASE_URI": "https://gateway.pinata.cloud/ipfs/QmUJrnabRCMLsnvXNryojLWcysc4WwJCLqWYvJcWADfZFo/chadsJSON/",
//   "showLogs": false
// }

// {
//   "PROJECT_NAME": "Lives of Asuna",
//   "COLLECTION_SIZE": 10000,
//   "START_INDEX": 1,
//   "END_INDEX": 9999,
//   "BASE_URI": "https://bafybeihpu7hkvxw7ebw6onsxep2yfdoh46qu6tbxibnchtqhh5ytm5lbai.ipfs.dweb.link/",
//   "showLogs": false
// }

// From what I understand trait normalized rarity should give more weight to categories fewer traits in them. So, the way I calculated it was to take the vanilla rarity score and multiply that by the average number of traits per category divided by the number of traits in that category,
// https://jwinterm.com/posts/raritycalc/

// 9666 - 1354 = 8312 without chains

// 69 -garlic chain score 9666/69 = 140

// total bats 9666
// 69 + 102 + 162 + 209 + 309 + 503 = 1354 total chains

// It's not shady, I just don't know their specific algorithm. Off the top of my head a basic way of doing this is:

// Find the mean rarity of any given category:

// Mouth: 0.01 (1%)
// Skin: 0.333 (33%)

// Multiply the statistical rarity value of the trait by that value.
// https://www.reddit.com/r/ethtrader/comments/qfgt43/any_idea_about_trait_normalization_on_raritytools/huu42gh/