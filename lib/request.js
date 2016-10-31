'use strict';

const request = require('request');

/**
 * Retrieves data from the specified endpoint API URL
 * @param {string} section Which section are we updating
 * @param {string} url full URL to the endpoint, parameters will be appended
 * @param {getEndpointCallback} callback
 */
module.exports = function(section, url, callback) {
  request(url, function(error, response, body) {
    if (error) {
      callback(error, section);
    } else if (response.statusCode == 200) {
      callback(null, section, body);
    } else if (response.statusCode == 404) {
      callback(null, section, 'Section unavailable.');
    } else {
      callback(null, section, 'Unexpected Response');
    }
  });
};
