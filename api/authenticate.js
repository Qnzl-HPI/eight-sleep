const EightSleep = require(`8slp`)

const {
  EIGHTSLEEP_EMAIL,
  EIGHTSLEEP_PASSWORD,
} = process.env

module.exports = async (req, res) => {
  const {
    level,
    duration,
  } = req.body

  const eightSleep = new EightSleep('America/New_York')

  const token = await eightSleep.authenticate(EIGHTSLEEP_EMAIL, EIGHTSLEEP_PASSWORD)

  return res.json(token)
}


