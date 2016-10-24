#!/usr/bin/env node

'use strict';

const request = require('request');
const Jetty = require('jetty');

const jetty = new Jetty(process.stdout);

const argv = require('yargs')
  .usage('Usage: $0 [options] [host]')
  .example('$0 -p 45678 10.0.0.12')
  .options({
    'p': {
      alias: 'port',
      nargs: 1,
      number: true,
      describe: 'Port of Teraslice master node',
      default: 5678,
    },
    't': {
      alias: 'timeout',
      nargs: 1,
      number: true,
      describe: 'Time between refresh (seconds)',
      default: 2,
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const host = argv._[0] || 'localhost';
const port = argv.p;
const baseUrl = 'http://' + host + ':' + port;

let requestInterval = argv.t * 2000;

const sections = {
  'Nodes': {
    'endpoint': '/txt/nodes',
    'value': '',
  },
  'Workers': {
    'endpoint': '/txt/workers',
    'value': '',
  },
  'Slicers': {
    'endpoint': '/txt/slicers',
    'value': '',
  },
  'Jobs': {
    'endpoint': '/txt/jobs',
    'value': '',
  },
  'Execution Contexts': {
    'endpoint': '/txt/ex',
    'value': '',
  },
};

// console.log('Teraslice master: %s:%s', host, port);
// console.log('Timeoute');
// console.log(baseUrl + sections['Nodes']);
// console.log(sections);

/**
 * Generates a Header
 * @param {string} title Short string representing title of section header.
 * @param {string} url URL of the API endpoint
 * @return {string} s The formatted string to be printed to title.
 */
function makeHeader(title, url) {
  return '--------------------------------------------------------------------------------\n' +
         '  ' + title + ' (' + url + ')'+ '\n' +
         '--------------------------------------------------------------------------------\n\n';
}

/**
 * Draws the whole screen
 */
function drawScreen() {
  jetty.clear();
  let date = new Date();
  for (let section in sections) {
    if (sections.hasOwnProperty(section)) {
      let url = baseUrl + sections[section].endpoint;
      process.stdout.write(makeHeader(section, url));
      process.stdout.write(sections[section].value);
    }
  }
  process.stdout.write('\n\nUpdated at: ' + date + '\n');
}

/**
 * Retrieves data from the specified endpoint API URL
 * @param  {string} section Which section are we updating
 * @param {getEndpointCallback} callback
 */
function getEndpoint(section, callback) {
  let url = baseUrl + sections[section].endpoint;
  let newUrl = url + '?size=10';  // restrict response to 10

  request(newUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(null, section, body);
    } else {
      callback(error, section);
    }
  });
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
    sections[section].value = body;
  }
};

// Hit all of the endpoints at the requested interval
for (let section in sections) {
  if (sections.hasOwnProperty(section)) {
    getEndpoint(section, setValue);  // hit endpoints once for first run
    setInterval(function() {
      getEndpoint(section, setValue);
    }, requestInterval);   // hit endpoints at interval
  }
}

jetty.clear();
drawScreen();
setInterval(drawScreen, 2000);
