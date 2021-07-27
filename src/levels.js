const steps = {
  2: 16,
  3: 17,
  4: 18,
  5: 19,
  6: 20,
  7: 22,
  8: 24,
  9: 26,
  10: 28,
  11: 30,
  12: 33,
  13: 36,
  14: 39,
  15: 42,
  16: 46,
  17: 50,
  18: 55,
  19: 60,
  20: 66,
  21: 72,
  22: 79,
  23: 86,
  24: 94,
  25: 103,
  26: 113,
  27: 124,
  28: 136,
  29: 149,
  30: 163,
  31: 178,
  32: 194,
  33: 211,
  34: 229,
  35: 248,
  36: 268,
  37: 289,
  38: 311,
  39: 334,
  40: 358,
  41: 383,
}

const getXpRequireForNextStep = (charLevel, charExp = 0) => {
  const modulo = charLevel % 10
  const nextLevel =
    modulo == 0 ? charLevel + 1 : charLevel + -(charLevel % 10) + 11

  let xpRequired = 0

  for (let level = charLevel + 1; level <= nextLevel; level++) {
    xpRequired += +steps[level]
  }

  return { nextLevel, xpRequired: xpRequired - charExp }
}

module.exports = {
  getXpRequireForNextStep,
}
