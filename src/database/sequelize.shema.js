
const Sequelize = require("sequelize"),
  config = require("../config.json"),
  dbcontext = config.dbcontext

// Context
const context = new Sequelize(dbcontext.database, dbcontext.username, dbcontext.password, dbcontext.options)
context.authenticate().then(
  a => console.log('Connection has been established successfully.'),
  err => console.error('Unable to connect to the database:', err)
)

const Metrics = context.define("metric", {
  oraclePriceUsd: Sequelize.INTEGER,
  skillPriceUsd: Sequelize.INTEGER,
  timestamp: {
    type: Sequelize.DATE,
    defaultValue: new Date(),
    allowNull: false,
  }
})

Metrics.sync()

module.exports = { context, Metrics }