const {
  getStakedSkills,
  getStakedRewardsSkills,
  getStakedTimeLeft,
  getAccountCharacters,
  getCharacterExpRewards,
  getCharacterExp,
  getCharacterStamina,
  getTotalSkillOwnedBy,
  getInGameOnlySkills,
  getUnclaimedSkills,
  getCharacterLvl,
} = require('./web3')

const { weiToSkill } = require('./utils')

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

const getData = async (addresses) => {
  let sumStaked = 0
  let sumUnclaimed = 0
  let sumInGame = 0
  let sumInWallet = 0
  return await Promise.all(
    addresses.map(async (wallet) => {
      // staked
      const staked = weiToSkill(await getStakedSkills(wallet))
      const stakedRewards = weiToSkill(await getStakedRewardsSkills(wallet))

      const stakeAvailableInSeconds = parseFloat(
        await getStakedTimeLeft(wallet)
      )
      let stakeAvailableAt = new Date()
      stakeAvailableAt.setSeconds(
        stakeAvailableAt.getSeconds() + stakeAvailableInSeconds
      )

      // chars
      const charIds = await getAccountCharacters(wallet)
      const chars = await Promise.all(
        charIds.map(async (id) => {
          const level = parseFloat(await getCharacterLvl(id)) + 1
          const stamina = await getCharacterStamina(id)
          const expRewards = await getCharacterExpRewards(id)
          const exp = await getCharacterExp(id)
          let staminaFullAt = new Date()
          staminaFullAt.setMinutes(
            staminaFullAt.getMinutes() + (200 - stamina) * 5
          )

          const xpRequiredForNextStep = getXpRequireForNextStep(level, 0)

          return {
            id,
            stamina,
            exp,
            expRewards,
            staminaFullAt,
            level,
            xpRequiredForNextStep,
          }
        })
      )

      // skills
      const unclaimed = weiToSkill(await getUnclaimedSkills(wallet))
      const inGame = weiToSkill(await getInGameOnlySkills(wallet))
      const inWallet =
        weiToSkill(await getTotalSkillOwnedBy(wallet)) - inGame - unclaimed

      sumStaked += staked + stakedRewards
      sumUnclaimed += unclaimed
      sumInGame += inGame
      sumInWallet += inWallet

      return {
        address: wallet,
        unclaimed,
        inGame,
        inWallet,
        staked,
        stakedRewards,
        total: staked + stakedRewards + unclaimed + inGame + inWallet,
        stakeUnlockedAt: stakeAvailableAt,
        chars: chars,
      }
    })
  )
}

const getPrintableChar = (char) => {
  const xpLeft = char.xpRequiredForNextStep.xpRequired - char.expRewards

  const xpMsg =
    xpLeft <= 0
      ? `Lv.${xpRequiredForNextStep.nextLevel} available !!`
      : `Lv.${xpRequiredForNextStep.nextLevel} -> missing ${xpLeft}`

  return `${char.stamina}/200 STA full at ${toFrenchDateTime(
    char.staminaFullAt
  )} || Lv.${char.level} || ${xpMsg}`
}

module.exports = {
  getXpRequireForNextStep,
  getData,
}
