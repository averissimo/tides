/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
const shouldIgnored = require('should');
const {describe, it} = require('mocha');
const {Tides} = require('.');

const t = new Tides();
const out = false;

describe('#forecast()', () => {
  it('responds with 7 days worth of data for \'Costa-de-Caparica\'', async () => {
    const forecast = await t.forecast('Costa-de-Caparica');

    if (out) {
      console.log(forecast);
    }
    forecast.length.should.be.aboveOrEqual(7);
    for (const el of forecast) {
      el.source.should.be.equal('tide-forecast.com');
      el.should.have.keys('date', 'data', 'source');
    }
  }).timeout(15000);
});
