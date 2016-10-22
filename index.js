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
const url = 'http://' + host + ':' + port;

const endpoints = {
  'Nodes': '/txt/nodes',
  'Workers': '/txt/workers',
  'Slicers': '/txt/slicers',
  'Jobs': '/txt/slicers',
  'Execution Contexts': '/txt/nodes',
};

console.log('Teraslice master: %s:%s', host, port);
console.log('Timeoute');
console.log(url + endpoints['Nodes']);
console.log(endpoints);

process.stdout.write(
  '\nNodes \n\
-----\n\n'
);

request(url + endpoints['Nodes'], function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
});
