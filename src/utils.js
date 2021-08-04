const { DateTime } = require('luxon')

const weiToSkill = (wei) => wei / 1000000000000000000

const toFrenchDateTime = (d) =>
  DateTime.fromJSDate(d)
    .setLocale('fr')
    .setZone('Europe/Paris')
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)

const round = (v) => Math.round(v * 10000) / 10000

module.exports = { weiToSkill, toFrenchDateTime, round }
