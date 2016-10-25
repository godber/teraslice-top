'use strict';

const Jetty = require('jetty');

const jetty = new Jetty(process.stdout);

/**
 * Draws the screen
 * @param  {sections} sections complete section object
 * @param  {string} url complete URL to the API endpoint
 */
module.exports = function(sections) {
  jetty
    .clear()
    .moveTo([0, 0]);

  let date = new Date();
  for (let section in sections) {
    if (sections.hasOwnProperty(section)) {
      process.stdout.write(makeHeader(section));
      process.stdout.write(sections[section].value);
    }
  }
  process.stdout.write(`\nUpdated at: ${date}\n`);
};

/**
 * Generates a Header
 * @param {string} title Short string representing title of section header.
 * @return {string} s The formatted string to be printed to title.
 */
function makeHeader(title) {
  return `
######  ${title}  ######

`;
}
