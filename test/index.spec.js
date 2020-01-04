const C = require('../lib/index')

describe('calculator ::', function () {
  it('evenRound()', () => {
    C.evenRound(3.4, 0).should.eql(3)
    C.evenRound(3.5, 0).should.eql(4)
    C.evenRound(4.5, 0).should.eql(4)
    C.evenRound(3, 0).should.eql(3)
    C.evenRound(0.3, 1).should.eql(0.3)
    C.evenRound(0.34, 1).should.eql(0.3)
    C.evenRound(0.35, 1).should.eql(0.4)
    C.evenRound(0.355, 1).should.eql(0.4)
    C.evenRound(0.36, 1).should.eql(0.4)
    C.evenRound(0.44, 1).should.eql(0.4)
    C.evenRound(0.45, 1).should.eql(0.4)
    C.evenRound(0.455, 1).should.eql(0.5)
    C.evenRound(0.46, 1).should.eql(0.5)
  })
  it('upRound()', () => {
    C.upRound(3.4, 0).should.eql(3)
    C.upRound(3.5, 0).should.eql(4)
    C.upRound(3, 0).should.eql(3)
  })
  it('ceil()', () => {
    C.ceil(3.4, 0).should.eql(4)
    C.ceil(3.5, 0).should.eql(4)
    C.ceil(4.5, 0).should.eql(5)
    C.ceil(3, 0).should.eql(3)
    C.ceil(0.3, 1).should.eql(0.3)
    C.ceil(0.34, 1).should.eql(0.4)
    C.ceil(0.35, 1).should.eql(0.4)
    C.ceil(0.355, 1).should.eql(0.4)
    C.ceil(0.36, 1).should.eql(0.4)
  })
  it('floor()', () => {
    C.floor(3.4, 0).should.eql(3)
    C.floor(3.5, 0).should.eql(3)
    C.floor(4.5, 0).should.eql(4)
    C.floor(3, 0).should.eql(3)
    C.floor(0.3, 1).should.eql(0.3)
    C.floor(0.35, 1).should.eql(0.3)
    C.floor(0.355, 1).should.eql(0.3)
    C.floor(0.36, 1).should.eql(0.3)
  })
  it('max()', () => {
    C.max(2.1, 3.1, 1.1).should.eql(3.1)
    C.max(C(2.1), 3.1, 1.1).should.eql(3.1)
    C.max(2.1, C(3.1), 1.1).should.eql(3.1)
    C.max(2.1, 3.1, C(1.1)).should.eql(3.1)
  })
  it('min()', () => {
    C.min(2.1, 3.1, 1.1).should.eql(1.1)
    C.min(C(2.1), 3.1, 1.1).should.eql(1.1)
    C.min(2.1, C(3.1), 1.1).should.eql(1.1)
    C.min(2.1, 3.1, C(1.1)).should.eql(1.1)
  })

  it('pow(x,y)', ()=>{
    C.pow(3, 2).should.eql(9)
    C.$pow(C(3), 2).v().should.eql(9)
    C.$pow(3, C(2)).v().should.eql(9)
  })
  it('abs(x)', ()=>{
    C.abs(1).should.eql(1)
    C.abs(-1).should.eql(1)
    C.$abs(-1).v().should.eql(1)
    C.$abs(C(-1)).v().should.eql(1)
  })
  describe('ccompile()', () => {
    it('ccompile()', () => {
      const fn1 = C.ccompile('1 + 1')
      const fn2 = C.ccompile('1 + 1')
      fn1.should.be.exactly(fn2)
      const fn3 = C.compile('1 + 1')
      const fn4 = C.compile('1 + 1')
      fn3.should.not.be.exactly(fn4)
    })
    it('performance', () => {
      const d = { x: -2.12, y: 3.7, z: 1.2 }
      C.ccompile('(d.x + d.y * d.z) / (d.y - d.z)', 'd')(d).should.eql(0.928)
      const st = Date.now()
      for (let i = 0; i < 10000; i++) {
        C.ccompile('(d.x + d.y * d.z) / (d.y - d.z)', 'd')(d)
      }
      (Date.now() - st).should.below(1000)
    })
  })

  it('eval()', () => {
    C.eval('1 + 1').should.eql(2)
  })

  describe('setup()', () => {
    it('default', () => {
      C.round.should.be.exactly(C.upRound)
    })
    it('ROUND_HALF_UP', () => {
      C.setup({ roundRode: C.ROUND_HALF_UP })
      C.round.should.be.exactly(C.upRound)
    })
    it('ROUND_HALF_EVEN', () => {
      C.setup({ roundRode: C.ROUND_HALF_EVEN })
      C.round.should.be.exactly(C.evenRound)
    })
    it('ROUND_HALF_CEIL', () => {
      C.setup({ roundRode: C.ROUND_HALF_CEIL })
      C.round.should.be.exactly(C.ceil)
    })
    it('ROUND_HALF_FLOOR', () => {
      C.setup({ roundRode: C.ROUND_HALF_FLOOR })
      C.round.should.be.exactly(C.floor)
    })
  })

})




