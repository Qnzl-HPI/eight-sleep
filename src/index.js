#!/usr/bin/env node

const EightSleep = require(`8slp`)
const fs = require(`fs`)
const yargs = require(`yargs/yargs`)
const { hideBin } = require(`yargs/helpers`)
const { promisify } = require(`util`)
const { resolve } = require(`path`)
const dayjs = require(`dayjs`)

const { argv } = yargs(hideBin(process.argv))

;(async () => {
  const {
    [`export-format`]: exportFormat = `{date}-8slp.json`,
    [`export-path`]: exportPath,
    username,
    password,
  } = argv

  const filledExportFormat = exportFormat
    .replace(`{date}`, dayjs().format(`YYYY-MM-DD`))

  const EXPORT_PATH = resolve(exportPath, filledExportFormat)

  const eightSleep = new EightSleep(`America/New_York`)
  await eightSleep.authenticate(username, password)

  const sessions = eightSleep.me.cache.userGet(`sessions`)

  await promisify(fs.writeFile)(EXPORT_PATH, JSON.stringify({ sessions }))
})()
