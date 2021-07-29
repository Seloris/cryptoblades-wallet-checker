const Sequelize = require("sequelize"),
  dbContext = require("./sequelize.shema")

const insertMetric = async (priceSnapshot) => {
  await dbContext.Metrics.create(priceSnapshot)
}

const getLastMetric = async () => {
  return await dbContext.Metrics.findOne({
    order: [['timestamp', 'DESC']]
  })
}

const getMetricsBetweenDates = async (startDate, endDate = new Date()) => {
  return await dbContext.Metrics.findAll({
    where: {
      [Sequelize.Op.and]: [{ timestamp: { [Sequelize.Op.gte]: startDate, [Sequelize.Op.lte]: endDate } }]
    },
    order: [['timestamp', 'ASC']]
  })
}

module.exports = { insertMetric, getLastMetric, getMetricsBetweenDates }