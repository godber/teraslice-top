#!/usr/bin/env node

'use strict';

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

const host = argv._[0] || `localhost`;
const port = argv.p;
const baseUrl = `http://${host}:${port}`;

let requestInterval = argv.t * 1000;  // convert seconds to ms

const sections = {
  'Nodes': {
    'endpoint': `/txt/nodes`,
    'value': '',
  },
  'Workers': {
    'endpoint': `/txt/workers`,
    'value': '',
  },
  'Slicers': {
    'endpoint': `/txt/slicers`,
    'value': '',
  },
  'Jobs': {
    'endpoint': `/txt/jobs`,
    'value': '',
  },
  'Execution Contexts': {
    'endpoint': `/txt/ex`,
    'value': '',
  },
};

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
    sections[section].value = '';
  } else {
    if (!body) {
      body = '';
    }
    sections[section].value = body;
  }
  draw(sections);
};

// Hit all of the endpoints at the requested interval
for (let section in sections) {
  if (sections.hasOwnProperty(section)) {
    let url = baseUrl + sections[section].endpoint;

    request(section, url, setValue);  // once for first run
    setInterval(function() {
      request(section, url, setValue);
    }, requestInterval);   // hit endpoints at interval
  }
}
