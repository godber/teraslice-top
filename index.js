#!/usr/bin/env node

'use strict';

const Teraslice = require('./lib/teraslice');
const request = require('./lib/request');
const draw = require('./lib/draw');

const argv = require('yargs')
  .usage(`Usage: $0 [options] [host]`)
  .example(`$0 -p 45678 10.0.0.12`)
  .options({
    'p': {
      alias: `port`,
      nargs: 1,
      number: true,
      describe: `Port of Teraslice master node`,
      default: 5678,
    },
    't': {
      alias: `timeout`,
      nargs: 1,
      number: true,
      describe: `Time between refresh (seconds)`,
      default: 2,
    },
  })
  .help('h')
  .alias('h', `help`)
  .argv;

let ts = new Teraslice(argv._[0], argv.p);  // host, port
let requestInterval = argv.t * 1000;  // convert seconds to ms

/**
 * Sets the value of the corresponding section to the response body
 * @param {string} error The error returned from the request
 * @param {string} section The section the request came from
 * @param {string} body The body of the response
 */
function setValue(error, section, body) {
  if (error) {
    // console.log(error);
    // Null out the value, a common errror is that the server is off
    ts.api[section].value = '';
  } else {
    if (!body) {
      body = '';
    }
    ts.api[section].value = body;
  }
  draw(ts);
};

// Hit all of the endpoints at the requested interval
for (let section in ts.api) {
  if (ts.api.hasOwnProperty(section)) {
    let url = ts.api[section].url;

    request(section, url, setValue);  // once for first run
    setInterval(function() {
      request(section, url, setValue);
    }, requestInterval);   // hit endpoints at interval
  }
}
