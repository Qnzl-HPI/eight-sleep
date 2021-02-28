const EightSleep = require(`8slp`)

const {
  EIGHTSLEEP_EMAIL,
  EIGHTSLEEP_PASSWORD,
} = process.env

module.exports = async (req, res) => {
  const {
    token: _token,
    authentication,
  } = req.headers

  const [ token, tokenExpiration ] = atob(_token).split(`/`)

  const {
    level,
    duration,
  } = req.body

  const eightSleep = new EightSleep('America/New_York')

  await eightSleep.authenticateWithToken(token, tokenExpiration)

  const response = await eightSleep.me.setLevel(level, duration)

  return res.json(response)
}

