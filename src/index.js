const { DateTime } = require('luxon')
const { weiToSkill, getPrintableChar, toFrenchDateTime } = require('./utils')
const { getData } = require('./core')

const addresses = {
  selo: [
    '0x1982845956B2d851B900632910a7e9C156AC5005',
    '0xB7C103F7bD5Da079cE55f275d4144B154A347C87',
    '0x66bA7e65E9301e2D995BA7f69b54d018d37bFe39',
    '0x8Bb989d8561f26Fe3D445C0ed9cbB66A930C0237',
    '0xC98bAA0Da17ad607Feb3868a32660b7E300ADeD2',
  ],
  zack: [],
  bubu: [],
}

;(async () => {
  const results = await getData(addresses.selo)
  console.log(results)
})()

// console.log(results)
// console.log('-------------------------------------------')
// console.log('      Dude => ' + dude)
// console.log(
//   `     TOTAL => ${sumStaked + sumUnclaimed + sumInGame + sumInWallet}`
// )
// console.log('-------------------------------------------')
// console.log(`    Staked => ${sumStaked}`)
// console.log(` Unclaimed => ${sumUnclaimed}`)
// console.log(` In Wallet => ${sumInWallet}`)
// console.log(`   In Game => ${sumInGame}`)
// console.log('-------------------------------------------')
