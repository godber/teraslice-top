#!/usr/bin/env node

'use strict';

const request = require('request');

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
      describe: 'Timeout between refresh (seconds)',
      default: 2,
    },
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const host = argv._[0] || 'localhost';
const port = argv.p;
const baseUrl = 'http://' + host + ':' + port;

const endpoints = {
  'Nodes': '/txt/nodes',
  'Workers': '/txt/workers',
  'Slicers': '/txt/slicers',
  'Jobs': '/txt/jobs',
  'Execution Contexts': '/txt/ex',
};

// console.log('Teraslice master: %s:%s', host, port);
// console.log('Timeoute');
console.log(baseUrl + endpoints['Nodes']);
// console.log(endpoints);

/**
 * Generates a Header
 * @param {string} title Short string representing title of section header.
 * @return {string} s The formatted string to be printed to title.
 */
function makeHeader(title) {
  return '--------------------------------------------------------------------------------\n' +
         '  ' + title + '\n' +
         '--------------------------------------------------------------------------------\n\n';
}


console.log(Object.keys(endpoints));

for (let endpoint in endpoints) {
  if (endpoints.hasOwnProperty(endpoint)) {
    process.stdout.write(makeHeader(endpoint));
    let url = baseUrl + endpoints[endpoint];
    process.stdout.write(url + '\n');
    console.log(getEndpoint(url));
  }
}

/**
 * Retrieves data from the specified endpoint API URL
 * @param  {string} url One of the valid endpoint urls
 * @return {string} s String with the values returned by the API
 */
function getEndpoint(url) {
  let newUrl = url + '?size=10';  // restrict response to 10
  let r = undefined;
  console.log(newUrl);
  request(newUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      r = body;
    } else {
      console.log(error);
      r = '';
    }
  });
  return r;
};
