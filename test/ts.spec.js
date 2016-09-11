/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const TimeCache = require('../src')

describe('time-cache', function () {
  this.timeout(10 * 1000)

  let tc

  it('creates time-cache', () => {
    tc = new TimeCache({ validity: 1 })
    expect(tc).to.exist
  })

  it('adds 3 values', (done) => {
    tc.put('k1')
    tc.put('k2', 'v2')
    tc.put('k3', new Buffer('v3'))

    expect(tc.has('k1')).to.be.true
    expect(tc.has('k2')).to.be.true
    expect(tc.has('k3')).to.be.true
    setTimeout(() => {
      tc.put('k4', 'v4')
      expect(tc.has('k1')).to.be.false
      expect(tc.has('k2')).to.be.false
      expect(tc.has('k3')).to.be.false
      expect(tc.has('k4')).to.be.true
      done()
    }, 2 * 1000)
  })

  it('adds value with custom validity', (done) => {
    tc.put('k5', '', 5)
    expect(tc.has('k5')).to.be.true
    setTimeout(() => {
      tc.put('k5', '', 5) // checks that it doesn't reset the clock
      expect(tc.has('k5')).to.be.true
    }, 2 * 1000)
    setTimeout(() => {
      tc.put('k5', '', 5) // checks that it doesn't reset the clock
      expect(tc.has('k5')).to.be.false
      done()
    }, 6 * 1000)
  })
})
