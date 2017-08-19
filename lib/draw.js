'use strict'

const Jetty = require('jetty')

const jetty = new Jetty(process.stdout)

/**
 * Draws the screen
 * @param  {ts} ts complete section object
 * @param  {string} url complete URL to the API endpoint
 */
module.exports = function (ts) {
  jetty
        .clear()
        .moveTo([0, 0])

  let date = new Date()
  for (let section in ts.api) {
    if (ts.api.hasOwnProperty(section)) {
      process.stdout.write(makeHeader(section))
      process.stdout.write(ts.api[section].value)
    }
  }
  process.stdout.write(`\nUpdated at: ${date}\n`)
}

/**
 * Generates a Header
 * @param {string} title Short string representing title of section header.
 * @return {string} s The formatted string to be printed to title.
 */
function makeHeader (title) {
  return `
######  ${title}  ######

`
}
