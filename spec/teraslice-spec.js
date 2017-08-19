'use strict';

const Teraslice = require('../lib/teraslice');

describe('Default Teraslice', function() {
    let ts = new Teraslice();

    it('has a list of api endpoints accessible at .api', function() {
        expect(typeof ts.api).toBe('object');
        expect(ts.api['Nodes'].url).toBe('http://localhost:5678/txt/nodes?size=8');
        expect(ts.api.Nodes.value).toBe('');
    });

    it('uses localhost as the default host', function() {
        expect(ts.host).toBe('localhost');
        expect(ts.baseUrl).toBe('http://localhost:5678');
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
        expect(ts.baseUrl).toBe('http://10.0.0.0:1234');
        expect(ts.api['Execution Contexts'].url).toBe('http://10.0.0.0:1234/txt/ex?size=8');
    });
});
