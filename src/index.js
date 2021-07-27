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

const { getXpRequireForNextStep } = require('./levels')

const { DateTime } = require('luxon')
const { weiToSkill } = require('./utils')

const addresses = {
  selo: [],
  zack: [],
  bubu: [],
}

const toFrenchDateTime = (d) =>
  DateTime.fromJSDate(d)
    .setLocale('fr')
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)

;(async () => {
  const getPrintableChar = (char) => {
    const xpRequiredForNextStep = getXpRequireForNextStep(+char.level, 0)
    const xpLeft = xpRequiredForNextStep.xpRequired - char.expRewards

    const xpMsg =
      xpLeft <= 0
        ? `Lv.${xpRequiredForNextStep.nextLevel} available !!`
        : `Lv.${xpRequiredForNextStep.nextLevel} -> missing ${xpLeft}`

    return `${char.stamina}/200 STA full at ${toFrenchDateTime(
      char.staminaFullAt
    )} || Lv.${char.level} || ${xpMsg}`
  }

  // in game 5.1248
  // balance 0.2486
  // staked 1.83

  let sumStaked = 0
  let sumUnclaimed = 0
  let sumInGame = 0
  let sumInWallet = 0

  const dude = 'bubu'
  const results = await Promise.all(
    addresses[dude].map(async (wallet) => {
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

          return { id, stamina, exp, expRewards, staminaFullAt, level }
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
        stakeUnlockedAt: toFrenchDateTime(stakeAvailableAt),
        chars: chars.map((x) => getPrintableChar(x)),
      }
    })
  )

  console.log(results)
  console.log('-------------------------------------------')
  console.log('      Dude => ' + dude)
  console.log(
    `     TOTAL => ${sumStaked + sumUnclaimed + sumInGame + sumInWallet}`
  )
  console.log('-------------------------------------------')
  console.log(`    Staked => ${sumStaked}`)
  console.log(` Unclaimed => ${sumUnclaimed}`)
  console.log(` In Wallet => ${sumInWallet}`)
  console.log(`   In Game => ${sumInGame}`)
  console.log('-------------------------------------------')
})()
