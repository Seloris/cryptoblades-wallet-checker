const Web3 = require('web3')

const conStakingReward = require('../smart/IStakingRewards.json')
const conStakingToken = require('../smart/IERC20.json')
const conCryptoBlades = require('../smart/CryptoBlades.json')
const conCharacters = require('../smart/Characters.json')
const conWeapons = require('../smart/Weapons.json')
const web3 = new Web3('https://bsc-dataseed.binance.org/')

const stakingRewardAddress = '0xd6b2D8f59Bf30cfE7009fB4fC00a7b13Ca836A2c'
const stakingTokenAddress = '0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab'
const mainAddress = '0x39Bea96e13453Ed52A734B6ACEeD4c41F57B2271'
const charAddress = '0xc6f252c2cdd4087e30608a35c022ce490b58179b'
const weapAddress = '0x7e091b0a220356b157131c831258a9c98ac8031a'
const defaultAddress = '0x0000000000000000000000000000000000000000'

const StakingReward = new web3.eth.Contract(
  conStakingReward.abi,
  stakingRewardAddress
)
const StakingToken = new web3.eth.Contract(
  conStakingToken.abi,
  stakingTokenAddress
)
const CryptoBlades = new web3.eth.Contract(conCryptoBlades.abi, mainAddress)
const Characters = new web3.eth.Contract(conCharacters.abi, charAddress)
const Weapons = new web3.eth.Contract(conWeapons.abi, weapAddress)

const getStakedSkills = async (address) =>
  StakingReward.methods.balanceOf(address).call({ from: defaultAddress })

const getStakedRewardsSkills = async (address) =>
  StakingReward.methods.earned(address).call({ from: defaultAddress })

const getStakedTimeLeft = async (address) =>
  StakingReward.methods.getStakeUnlockTimeLeft().call({ from: address })

const getAccountCharacters = async (address) =>
  CryptoBlades.methods.getMyCharacters().call({ from: address })

const getUnclaimedSkills = async (address) =>
  CryptoBlades.methods.getTokenRewardsFor(address).call({ from: address })

const getTotalSkillOwnedBy = async (address) =>
  CryptoBlades.methods.getTotalSkillOwnedBy(address).call({ from: address })

const getInGameOnlySkills = async (address) =>
  CryptoBlades.methods.inGameOnlyFunds(address).call({ from: address })

const getCharacterExpRewards = async (charId) =>
  CryptoBlades.methods.getXpRewards(charId).call({ from: defaultAddress })

const getCharacterStamina = async (charId) =>
  Characters.methods.getStaminaPoints(charId).call({ from: defaultAddress })

const getCharacterLvl = async (charId) =>
  Characters.methods.getLevel(charId).call({ from: defaultAddress })

const getCharacterExp = async (charId) =>
  Characters.methods.getXp(charId).call({ from: defaultAddress })

module.exports = {
  getStakedSkills,
  getStakedRewardsSkills,
  getStakedTimeLeft,
  getTotalSkillOwnedBy,
  getAccountCharacters,
  getCharacterExpRewards,
  getCharacterExp,
  getCharacterStamina,
  getUnclaimedSkills,
  getInGameOnlySkills,
  getTotalSkillOwnedBy,
  getCharacterLvl,
}
