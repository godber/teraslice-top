#!/usr/bin/env node

'use strict';

const Promise = require('bluebird');
const Teraslice = require('./lib/teraslice');
const request = require('request-promise');
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

let ts = new Teraslice(argv._[0], argv.p); // host, port
let requestInterval = argv.t * 1000; // convert seconds to ms

const sections = ['Nodes', 'Workers', 'Slicers', 'Jobs', 'Execution Contexts'];

setInterval(function() {
    Promise.map(sections, function(section) {
        // request info from all API endpoints
        return request({
            uri: ts.api[section].url,
            resolveWithFullResponse: true, // we want the full response, not just body
            simple: false, // promise not rejected in case of 404, handle 404s manually
        });
    }).then(function(responses) {
        // populate the ts.api[section].value fields
        for (let i = 0; i < responses.length; i++) {
            handleResponse(sections[i], responses[i]);
        }
        return;
    }).then(function() {
        draw(ts);
    }).catch(function(e) {
        console.error(`Error: ${e}`);
    });
}, requestInterval); // draw screen at interval

/**
 * This function processes responses from the API request and sets values in ts
 * @param  {string} section  One of the API endpoint/section titles
 * @param  {object} response Response object from the request-promise library
 */
function handleResponse(section, response) {
    if (response.statusCode == 200) {
        if (!response.body) {
            ts.api[section].value = '';
        } else {
            ts.api[section].value = response.body;
        }
    } else if (response.statusCode == 404) {
        ts.api[section].value = 'Section unavailable';
    } else {
        ts.api[section].value = 'Unexpected Response';
    };
}
