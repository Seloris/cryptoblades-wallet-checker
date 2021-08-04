const { round, toFrenchDateTime } = require('./utils')
const { getData, getPrintableChar } = require('./core')

const COLORS = [7419530, 3447003, 10038562, 15105570, 15844367, 10181046]


const DB = {
  USERS: {},
}

const Discord = require('discord.js')
const { getOracleCurrentPrice } = require('./web3')
const client = new Discord.Client()
client.on('ready', function () {
  console.log('READY')

  setInterval(async () => {
    try {
      const oraclePrice = await getOracleCurrentPrice()
      client.user.setActivity(`Oracle $${oraclePrice}`, {
        type: 'WATCHING',
      })
    } catch (e) {
      console.error(e)
    }
  }, 10000)
})

const cmd_getWalletsRecap = async (msg) => {
  const user = DB.USERS[msg.author.id];
  if (!user) {
    msg.reply('tape !cb setup <wallets> 🤦‍♂️🤦‍♂️🤦‍♂️')
    return
  }

  const datas = await getData(user.wallets)

  const total = {
    unclaimed: 0,
    inGame: 0,
    inWallet: 0,
    staked: 0,
  }
  // wallets
  datas.map((data, i) => {
    const unclaimed = round(data.unclaimed)
    const inGame = round(data.inGame)
    const inWallet = round(data.inWallet)
    const staked = round(data.staked + data.stakedRewards)

    total.unclaimed += unclaimed
    total.inGame += inGame
    total.inWallet += inWallet
    total.staked += staked

    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      .setTitle(`Wallet ${i + 1} 🔒 ${toFrenchDateTime(data.stakeUnlockedAt)}`)
      // Set the color of the embed
      .setColor(COLORS[i])
      .addField('Unclaimed', unclaimed, true)
      .addField('In Game', inGame, true)
      .addField('Wallet', inWallet, true)
      .addField('Staked', staked, true)
      .setDescription(data.chars.map((x) => getPrintableChar(x)))

    msg.author.send(embed)
  })

  // recap
  const embed = new Discord.MessageEmbed()
    // Set the title of the field
    .setTitle(`Total 🌑`)
    // Set the color of the embed
    .setColor(COLORS[0])
    .addField('Unclaimed', round(total.unclaimed), true)
    .addField('In Game', round(total.inGame), true)
    .addField('Wallet', round(total.inWallet), true)
    .addField('Staked', round(total.staked), true)

  msg.author.send(embed)
}

const cmd_setupWallets = (msg, wallets) => {
  DB.USERS[msg.author.id] = { wallets }
  msg.reply(`${wallets.length} wallets setup 👌`)
}

const prefix = '!'

// Répondre à un message
client.on('message', async (msg) => {
  if (msg.author.bot) return
  if (!msg.content.startsWith(prefix)) return

  const commandBody = msg.content.slice(prefix.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()

  if (command == 'cb') {
    const subCmd = args[0]

    console.log(msg.author.id)

    if (subCmd == 'setup') {
      const addresses = args.slice(1)
      cmd_setupWallets(msg, addresses)
    }

    if (subCmd === 'oracle') {
      const oraclePrice = await getOracleCurrentPrice()

      msg.reply(`$${oraclePrice}`)
    }

    if (subCmd == 'recap') {
      await cmd_getWalletsRecap(msg)
    }
  }
})

client.login(process.env.BOT_TOKEN)
