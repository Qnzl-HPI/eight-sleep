const EightSleep = require(`8slp`)

const {
  EIGHTSLEEP_EMAIL,
  EIGHTSLEEP_PASSWORD,
} = process.env

module.exports = async (req, res) => {
  const eightSleep = new EightSleep('America/New_York')

  await eightSleep.authenticate(EIGHTSLEEP_EMAIL, EIGHTSLEEP_PASSWORD)

  const sessions = eightSleep.me.cache.userGet(`sessions`)

  return res.json(sessions)
}
