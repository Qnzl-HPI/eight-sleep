#!/usr/bin/env node

const { URLSearchParams } = require('url')
const { promisify } = require('util')
const EightSleep = require(`8slp`)
const dayjs = require(`dayjs`)
const { Command } = require('commander')
const fs = require('fs')

const program = new Command()

process.on('unhandledRejection', onfatal)
process.on('uncaughtException', onfatal)

function onfatal(err) {
  console.log('fatal:', err.message)
  exit(1)
}

function exit(code) {
  process.nextTick(process.exit, code)
}

program
  .command('dump')
  .description('Dump to file')
  .option('--email [email]', 'Eight Sleep email')
  .option('--password [password]', 'Eight Sleep password')
  .option('--export-format [format]', 'Export file format')
  .option('--export-path [path]', 'Export file path')
  .action(dump)

async function dump(args) {
  const {
    [`export-format`]: exportFormat = `{date}-8slp.json`,
    [`export-path`]: exportPath,
    email,
    password,
  } = args

  const filledExportFormat = exportFormat
    .replace(`{date}`, dayjs().format(`YYYY-MM-DD`))

  const EXPORT_PATH = resolve(exportPath, filledExportFormat)

  const eightSleep = new EightSleep(`America/New_York`)
  await eightSleep.authenticate(username, password)

  const sessions = eightSleep.me.cache.userGet(`sessions`)

  await promisify(fs.writeFile)(EXPORT_PATH, JSON.stringify({ sessions }))
}
