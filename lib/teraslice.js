'use strict';

module.exports = function(host, port) {
  this.host = host || `localhost`;
  this.port = port || 5678;
  this.url = `http://${this.host}:${this.port}`;

  this.api = {
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
};
