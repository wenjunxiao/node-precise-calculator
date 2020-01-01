const {
  evenRound
} = require('../lib/utils')

describe('utils ::', function () {
  describe('evenRound()', () => {
    it('evenRound(3.15, 0, 1) = 3.2', () => {
      evenRound(3.15, 0, 1).should.eql(3.2)
    })
    it('evenRound(3.25, 0, 1) = 3.2', () => {
      evenRound(3.25, 0, 1).should.eql(3.2)
    })
    it('evenRound(3.5, 0, 0) = 4', () => {
      evenRound(3.5, 0, 0).should.eql(4)
    })
    it('evenRound(4.5, 0, 0) = 4', () => {
      evenRound(4.5, 0, 0).should.eql(4)
    })
  })
})