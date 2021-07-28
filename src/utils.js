const weiToSkill = (wei) => wei / 1000000000000000000

const toFrenchDateTime = (d) =>
  DateTime.fromJSDate(d)
    .setLocale('fr')
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)

module.exports = { weiToSkill, toFrenchDateTime }
