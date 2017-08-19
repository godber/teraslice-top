'use strict'

module.exports = function (host, port) {
  this.host = host || `localhost`
  this.port = port || 5678
  this.baseUrl = `http://${this.host}:${this.port}`
  this.param = '?size=8'

  this.api = {
    'Nodes': {
      'url': `${this.baseUrl}/txt/nodes${this.param}`,
      'value': ''
    },
    'Workers': {
      'url': `${this.baseUrl}/txt/workers${this.param}`,
      'value': ''
    },
    'Slicers': {
      'url': `${this.baseUrl}/txt/slicers${this.param}`,
      'value': ''
    },
    'Jobs': {
      'url': `${this.baseUrl}/txt/jobs${this.param}`,
      'value': ''
    },
    'Execution Contexts': {
      'url': `${this.baseUrl}/txt/ex${this.param}`,
      'value': ''
    }
  }
}
