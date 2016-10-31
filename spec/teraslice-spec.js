'use strict';

const Teraslice = require('../lib/teraslice');

describe('Default Teraslice', function() {
  let ts = new Teraslice();

  it('has a list of api endpoints accessible at .api', function() {
    expect(typeof ts.api).toBe('object');
    expect(ts.api.Nodes.endpoint).toBe('/txt/nodes');
    expect(ts.api.Nodes.value).toBe('');
  });

  it('uses localhost as the default host', function() {
    expect(ts.host).toBe('localhost');
    expect(ts.url).toBe('http://localhost:5678');
  });

  it('can be moified to store the results from the API', function() {
    expect(ts.api.Nodes.value).toBe('');
    ts.api.Nodes.value = 'test';
    expect(ts.api.Nodes.value).toBe('test');
    expect(ts.api['Nodes'].value).toBe('test');
  });
});

describe('Custom Teraslice', function() {
  let ts = new Teraslice('10.0.0.0', 1234);

  it('uses localhost as the default host', function() {
    expect(ts.host).toBe('10.0.0.0');
    expect(ts.url).toBe('http://10.0.0.0:1234');
  });
});
