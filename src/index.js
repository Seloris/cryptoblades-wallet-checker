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
  selo: [
    '0x1982845956B2d851B900632910a7e9C156AC5005',
    '0xB7C103F7bD5Da079cE55f275d4144B154A347C87',
    '0x66bA7e65E9301e2D995BA7f69b54d018d37bFe39',
    '0x8Bb989d8561f26Fe3D445C0ed9cbB66A930C0237',
    '0xC98bAA0Da17ad607Feb3868a32660b7E300ADeD2',
  ],
  zack: [
    '0x72cB47c118DC41754B37C1B36Dc0d1C31A7A224F',
    '0x0c5DFB886410F830B9E383b1a5477f772f45A4C7',
    '0x4ab8a0307FC4b08EA642b3dbdABCE27Bb46F6394',
    '0xFc1D7eFDf8e36c5Ba85dC81359f10B978Ed59C70',
  ],
  bubu: [
    '0x1b789290472D007a4dBC17966CBC7a8F9b4D665F',
    '0xf58Fa88d19C097DaB413647519499B8C46D687f9',
    '0xa0012B513F4cf41ca5E3E97f62a002f8280e3b9D',
    '0xFb30ec7c7961D37aE1e792E28bADc13cc7225c59',
  ],
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
