/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
const shouldIgnored = require('should');
const {describe, it} = require('mocha');
const {Tides} = require('.');

const t = new Tides();
const out = true;

describe('#forecast()', () => {
  it('responds with 7 days worth of data for \'Costa-de-Caparica\'', async () => {
    const forecast = await t.forecast('Costa-de-Caparica');
    if (out) {
      for (const el of forecast) {
        for (const k in el) {
          if (k === 'data') {
            console.log('  * data:');
            el[k].forEach(el2 => console.log('    * ', el2));
          } else {
            console.log(k, ': ', el[k]);
          }
        }
      }
      console.log('Response:\n\n', forecast, '\n\n');
    }
    forecast.length.should.be.aboveOrEqual(7);
    for (const el of forecast) {
      el.source.should.be.equal('tide-forecast.com');
      el.should.have.keys('date', 'data', 'source');
    }
  }).timeout(15000);
});
