const C = require('../lib/index')
C.withoutStrict().withStrict();

describe('Calculator ::', function () {
  describe('add()', () => {
    it('1 + 1 = 2', () => {
      C(1).add(1).v().should.eql(2)
      C(1).add(1).vs().should.eql('2')
      C.compile('1 + 1')().should.eql(2)
      C.compile('(1 + 1){s}')().should.eql('2')
      C(1).$add(C(1)).v().should.eql(2)
      C(1).$add(C(1)).vs().should.eql('2')
    })
    it('1 + 0 = 1', () => {
      C(1).add(0).v().should.eql(1)
      C(1).add(0).vs().should.eql('1')
      C.compile('1 + 0')().should.eql(1)
      C.compile('(1 + 0){s}')().should.eql('1')
      C(C(1)).add(0).v().should.eql(1)
    })
    it('0 + 1 = 1', () => {
      C(0).add(1).v().should.eql(1)
      C('0').add(1).vs().should.eql('1')
      C(0).add('1').vs().should.eql('1')
      C.compile('0 + 1')().should.eql(1)
      C.compile('(0 + 1){s}')().should.eql('1')
    })
    it('-1 + -1 = -2', () => {
      C(-1).add(-1).v().should.eql(-2)
      C(-1).add(-1).vs().should.eql('-2')
      C.compile('-1 + -1')().should.eql(-2)
      C.compile('(-1 + -1){s}')().should.eql('-2')
    })
    it('0.0 + 1.1 + 2.22 + 3.333 + 4.4444 = 11.0974', () => {
      C(0.0).add(1.1).add(2.22).add(3.333).add(4.4444).v().should.eql(11.0974)
      C(0.0).add(1.1).add(2.22).add(3.333).add(4.4444).vs().should.eql('11.0974')
      C.compile('0.0 + 1.1 + 2.22 + 3.333 + 4.4444')().should.eql(11.0974)
      C.compile('0.0 + (1.1 + 2.22) + (3.333 + 4.4444)')().should.eql(11.0974)
      C.compile('0.0 + ((3.333 + 4.4444) + (1.1 + 2.22))')().should.eql(11.0974)
      C.compile('(0.0 + (1.1 + 2.22 + 3.333) + 4.4444){s}')().should.eql('11.0974')
    })
    it('1.00e5 + 2.00e4 = 120000', () => {
      C(1.00e5).add(2.00e4).v().should.eql(120000)
      C.compile('1.00e5 + 2.00e4')().should.eql(120000)
      C.compile('(1.00e5 + 2.00e4){s}')().should.eql('120000')
    })
    it('-1.00e5 + -2.00e4 = -120000', () => {
      C(-1.00e5).add(-2.00e4).v().should.eql(-120000)
      C.compile('-1.00e5 + -2.00e4')().should.eql(-120000)
      C.compile('(-1.00e5 + -2.00e4){s}')().should.eql('-120000')
    })
    it('1.00e21 + 2.00e22 = 2.1e+22', () => {
      C(1.00e21).add(2.00e22).v().should.eql(2.1e+22)
      C.compile('1.00e21 + 2.00e22')().should.eql(2.1e22)
      C.compile('(1.00e21 + 2.00e22){s}')().should.eql('21000000000000000000000')
    })
    it('-1.00e21 + -2.00e22 = -2.1e+22', () => {
      C(-1.00e21).add(-2.00e22).v().should.eql(-2.1e+22)
      C.compile('-1.00e21 + -2.00e22')().should.eql(-2.1e22)
      C.compile('(-1.00e21 + -2.00e22){s}')().should.eql('-21000000000000000000000')
    })
    it('1.25e-7 + 2.12e-8 = 1.462e-7', () => {
      C(1.25e-7).add(2.12e-8).v().should.eql(1.462e-7)
      C.compile('1.25e-7 + 2.12e-8')().should.eql(1.462e-7)
      C.compile('(1.25e-7 + 2.12e-8){s}')().should.eql('0.0000001462')
    })
    it('-1.25e-7 + -2.12e-8 = -1.462e-7', () => {
      C(-1.25e-7).add(-2.12e-8).v().should.eql(-1.462e-7)
      C.compile('-1.25e-7 + -2.12e-8')().should.eql(-1.462e-7)
      C.compile('(-1.25e-7 + -2.12e-8){s}')().should.eql('-0.0000001462')
    })
  })

  describe('sub()', () => {
    it('1 - 1 = 0', () => {
      C(1).sub(1).v().should.eql(0)
      C(1).sub(1).vs().should.eql('0')
      C.compile('1 - 1')().should.eql(0)
      C.compile('(1 - 1){s}')().should.eql('0')
    })
    it('-1 - -1 = 0', () => {
      C(-1).sub(-1).v().should.eql(0)
      C(-1).sub(-1).vs().should.eql('0')
      C.compile('-1 - -1')().should.eql(0)
      C.compile('(-1 - -1){s}')().should.eql('0')
    })
    it('1 - 0 = 1', () => {
      C(1).sub(0).v().should.eql(1)
      C(1).sub(0).vs().should.eql('1')
      C.compile('1 - 0')().should.eql(1)
      C.compile('(1 - 0){s}')().should.eql('1')
    })
    it('0 - 1 = -1', () => {
      C(0).sub(1).v().should.eql(-1)
      C('0').sub(1).vs().should.eql('-1')
      C(0).sub('1').vs().should.eql('-1')
      C.compile('0 - 1')().should.eql(-1)
      C.compile('(0 - 1){s}')().should.eql('-1')
    })
    it('0.0 - 1.1 - 2.22 - 3.333 - 4.4444 = -11.0974', () => {
      C(0.0).sub(1.1).sub(2.22).sub(3.333).sub(4.4444).v().should.eql(-11.0974)
      C(0.0).sub(1.1).sub(2.22).sub(3.333).sub(4.4444).vs().should.eql('-11.0974')
      C.compile('0.0 - 1.1 - 2.22 - 3.333 - 4.4444')().should.eql(-11.0974)
      C.compile('0.0 - (1.1 - 2.22) - (3.333 - 4.4444)')().should.eql(2.2314)
      C.compile('0.0 - ((3.333 - 4.4444) - (1.1 - 2.22))')().should.eql(-0.0086)
      C.compile('(0.0 - (1.1 - 2.22 - 3.333) - 4.4444){s}')().should.eql('0.0086')
    })
    it('1.00e5 - 2.00e4 = 80000', () => {
      C(1.00e5).sub(2.00e4).v().should.eql(80000)
      C.compile('1.00e5 - 2.00e4')().should.eql(80000)
      C.compile('(1.00e5 - 2.00e4){s}')().should.eql('80000')
    })
    it('-1.00e5 - -2.00e4 = -80000', () => {
      C(-1.00e5).sub(-2.00e4).v().should.eql(-80000)
      C.compile('-1.00e5 - -2.00e4')().should.eql(-80000)
      C.compile('(-1.00e5 - -2.00e4){s}')().should.eql('-80000')
    })
  })

  describe('mul()', () => {
    it('1 * 0 = 0', () => {
      C(1).mul(0).v().should.eql(0)
      C(1).mul(0).vs().should.eql('0')
      C.compile('1 * 0')().should.eql(0)
      C.compile('(1 * 0){s}')().should.eql('0')
    })
    it('0 * 1 = 0', () => {
      C(0).mul(1).v().should.eql(0)
      C(0).mul(1).vs().should.eql('0')
      C.compile('0 * 1')().should.eql(0)
      C.compile('(0 * 1){s}')().should.eql('0')
    })
    it('0 * 1 = 0', () => {
      C(0).mul(1).v().should.eql(0)
      C('0').mul(1).vs().should.eql('0')
      C(0).mul('1').vs().should.eql('0')
      C.compile('0 * 1')().should.eql(0)
      C.compile('(0 * 1){s}')().should.eql('0')
    })
    it('-1 * -2 = 2', () => {
      C(-1).mul(-2).v().should.eql(2)
      C(-1).mul(-2).vs().should.eql('2')
      C.compile('-1 * -2')().should.eql(2)
      C.compile('(-1 * -2){s}')().should.eql('2')
    })
    it('1.1 * 2.22 * 3.333 * 4.4444 = 36.1737982584', () => {
      C(1.1).mul(2.22).mul(3.333).mul(4.4444).v().should.eql(36.1737982584)
      C(1.1).mul(2.22).mul(3.333).mul(4.4444).vs().should.eql('36.1737982584')
      C.compile('1.1 * 2.22 * 3.333 * 4.4444')().should.eql(36.1737982584)
      C.compile('(1.1 * 2.22) * (3.333 * 4.4444)')().should.eql(36.1737982584)
      C.compile('((3.333 * 4.4444) * (1.1 * 2.22))')().should.eql(36.1737982584)
      C.compile('((1.1 * 2.22 * 3.333) * 4.4444){s}')().should.eql('36.1737982584')
    })
    it('1.00e5 * 2.00e4 = 2000000000', () => {
      C(1.00e5).mul(2.00e4).v().should.eql(2000000000)
      C.compile('1.00e5 * 2.00e4')().should.eql(2000000000)
      C.compile('(1.00e5 * 2.00e4){s}')().should.eql('2000000000')
    })
    it('1.00e5 * -2.00e4 = -2000000000', () => {
      C(1.00e5).mul(-2.00e4).v().should.eql(-2000000000)
      C.compile('1.00e5 * -2.00e4')().should.eql(-2000000000)
      C.compile('-1.00e5 * 2.00e4')().should.eql(-2000000000)
      C.compile('(1.00e5 * -2.00e4){s}')().should.eql('-2000000000')
      C.compile('(1.00e5 * -2.00e4){e}')().should.eql('-2e+9')
    })
  })

  describe('div()', () => {
    it('1 / 0 = Infinity', () => {
      C(1).div(0).v().should.eql(Infinity)
      C(1).div(0).vs().should.eql('Infinity')
      C.compile('1 / 0')().should.eql(Infinity)
      C.compile('(1 / 0){s}')().should.eql('Infinity')
    })
    it('0 / 1 = 0', () => {
      C(0).div(1).v().should.eql(0)
      C(0).div(1).vs().should.eql('0')
      C.compile('0 / 1')().should.eql(0)
      C.compile('(0 / 1){s}')().should.eql('0')
      C.compile('(0 / 1){e}')().should.eql('0')
    })
    it('0 / 1 = 0', () => {
      C(0).div(1).v().should.eql(0)
      C('0').div(1).vs().should.eql('0')
      C(0).div('1').vs().should.eql('0')
      C.compile('0 / 1')().should.eql(0)
      C.compile('(0 / 1){s}')().should.eql('0')
      C.compile('(0 / 1){e}')().should.eql('0')
    })
    it('4 / (4 / 2) = 2', () => {
      C(4).$div(C(4).div(2)).v().should.eql(2)
      C('4').$div(C(4).div(2)).vs().should.eql('2')
      C(4).$div(C(4).div('2')).vs().should.eql('2')
      C.compile('4 / (4 / 2)')().should.eql(2)
      C.compile('(4 / (4 / 2)){s}')().should.eql('2')
    })
    it('1.1 / 2.22 / 3.333 / 4.4444 = 0.033449625371287164', () => {
      C(1.1).div(2.22).div(3.333).div(4.4444).v().should.eql(0.033449625371287164)
      C(1.1).div(2.22).div(3.333).div(4.4444).vs().should.eql('0.033449625371287164')
      C.compile('1.1 / 2.22 / 3.333 / 4.4444')().should.eql(0.033449625371287164)
      C.compile('(1.1 / 2.22) / (3.333 / 4.4444)')().should.eql(0.6607201260666606)
      C.compile('(1.1 / (2.22 / 3.333 / 4.4444))')().should.eql(7.33986654054054)
      C.compile('((1.1 / 2.22 / 3.333) / 4.4444){s}')().should.eql('0.033449625371287164')
    })
    it('1.00e+23 / 2.00e1 = 5e+21', () => {
      C(1.00e+23).div(2.00e1).v().should.eql(5e+21)
      C(1.00e+23).div(2.00e1).vs().should.eql('5000000000000000000000')
      C.compile('1.00e+23 / 2.00e1')().should.eql(5e+21)
      C.compile('(1.00e+23 / 2.00e1){s}')().should.eql('5000000000000000000000')
    })
    it('1.00e+23 / 4.00e1 = 2.5e+21', () => {
      C(1.00e+23).div(4.00e1).v().should.eql(2.5e+21)
      C(1.00e+23).div(4.00e1).vs().should.eql('2500000000000000000000')
      C.compile('1.00e+23 / 4.00e1')().should.eql(2.5e+21)
      C.compile('(1.00e+23 / 4.00e1){s}')().should.eql('2500000000000000000000')
      C.compile('(1.00e+23 / 4.00e1){e}')().should.eql('2.5e+21')
    })
    it('1.00e-23 / 4.00e-1 = 2.5e-23', () => {
      C(1.00e-23).div(4.00e-1).v().should.eql(2.5e-23)
      C(1.00e-23).div(4.00e-1).vs().should.eql('0.000000000000000000000025')
      C.compile('1.00e-23 / 4.00e-1')().should.eql(2.5e-23)
      C.compile('(1.00e-23 / 4.00e-1){s}')().should.eql('0.000000000000000000000025')
    })
    it('1.00 / 2.00e23 = 5e-23', () => {
      C(1.00).div(2.00e23).v().should.eql(5e-24)
      C(1.00).div(2.00e23).vs().should.eql('0.000000000000000000000005')
      C.compile('1.00 / 2.00e23')().should.eql(5e-24)
      C.compile('(1.00 / 2.00e23){s}')().should.eql('0.000000000000000000000005')
      C.compile('(1.00 / 2.00e23){e}')().should.eql('5e-24')
    })
    it('1.00 / 2.5e23 = 4e-24', () => {
      C(1.00).div(2.5e23).v().should.eql(4e-24)
      C(1.00).div(2.5e23).vs().should.eql('0.000000000000000000000004')
      C.compile('1.00 / 2.5e23')().should.eql(4e-24)
      C.compile('(1.00 / 2.5e23){s}')().should.eql('0.000000000000000000000004')
      C.compile('(1.00 / 2.5e23){e}')().should.eql('4e-24')
    })
    it('1.00 / 4.00e23 = 2.5e-23', () => {
      C(1.00).div(4.00e23).v().should.eql(2.5e-24)
      C(1.00e-23).div(4.00e-1).vs().should.eql('0.000000000000000000000025')
      C.compile('1.00e-23 / 4.00e-1')().should.eql(2.5e-23)
      C.compile('(1.00e-23 / 4.00e-1){s}')().should.eql('0.000000000000000000000025')
      C.compile('(1.00e-23 / 4.00e-1){e}')().should.eql('2.5e-23')
    })
    it('1.00e-23 / 2.5e-1 = 4e-23', () => {
      C(1.00e-23).div(2.5e-1).v().should.eql(4e-23)
      C(1.00e-23).div(2.50e-1).vs().should.eql('0.00000000000000000000004')
      C.compile('1.00e-23 / 2.50e-1')().should.eql(4e-23)
      C.compile('(1.00e-23 / 2.50e-1){s}')().should.eql('0.00000000000000000000004')
      C.compile('(1.00e-23 / 2.50e-1){e}')().should.eql('4e-23')
    })
    it('2.4e+3 / 1.2e+2 = 20', () => {
      C('2.4e+3').div('1.2e+2').v().should.eql(20)
      C('2.4e+3').div('1.2e+2').vs().should.eql('20')
      C.compile('2.4e+3 / 1.2e+2')().should.eql(20)
      C.compile('(2.4e+3 / 1.2e+2){s}')().should.eql('20')
      C.compile('(2.4e+3 / 1.2e+2){e}')().should.eql('2e+1')
    })
    it('1 / 1048576 = 9.5367431640625e-7', () => {
      C(1).div(1048576).v().should.eql(9.5367431640625e-7)
      C(1).div(1048576).vs().should.eql('0.00000095367431640625')
      C.compile('1 / 1048576')().should.eql(9.5367431640625e-7)
      C.compile('(1 / 1048576){s}')().should.eql('0.00000095367431640625')
    })
    it('0.1953125 / 1953125 = 1e-7', () => {
      C(0.1953125).div(1953125).v().should.eql(1e-7)
    })
  })

  describe('max()', () => {
    it('max(1, 2) = 2', () => {
      C(1).max(2).v().should.eql(2)
      C(2).max(1).v().should.eql(2)
      C.compile('max(1, 2)')().should.eql(2)
      C.compile('max(2, 1)')().should.eql(2)
    })
    it('max(3.1, 1.1, 2.1) = 3.1', () => {
      C(3.1).max(1.1).max(2.1).v().should.eql(3.1)
      C(3.1).max(2.1).max(1.1).v().should.eql(3.1)
      C(1.1).max(2.1).max(3.1).v().should.eql(3.1)
      C(2.1).max(1.1).max(3.1).v().should.eql(3.1)
      C.compile('max(3.1, 1.1, 2.1)')().should.eql(3.1)
      C.compile('max(1.1, 3.1, 2.1)')().should.eql(3.1)
      C.compile('max(1.1, 2.1, 3.1)')().should.eql(3.1)
    })
    it('max(1.12, 1.1, 1.113) = 1.12', () => {
      C(1.12).max(1.1).max(1.113).v().should.eql(1.12)
      C(1.1).max(1.12).max(1.113).v().should.eql(1.12)
      C(1.113).max(1.12).max(1.1).v().should.eql(1.12)
      C(1.113).max(1.1).max(1.12).v().should.eql(1.12)
      C.compile('max(1.12, 1.113, 1.1)')().should.eql(1.12)
      C.compile('max(1.1, 1.12, 1.113)')().should.eql(1.12)
      C.compile('max(1.1, 1.113, 1.12)')().should.eql(1.12)
    })
    it('max(0, -1.12, 1.12) = 1.12', () => {
      C(0).max(-1.12).max(1.12).v().should.eql(1.12)
      C(0).max(1.12).max(-1.12).v().should.eql(1.12)
      C(1.12).max(-1.12).max(0).v().should.eql(1.12)
      C(-1.12).max(0).max(1.12).v().should.eql(1.12)
      C.compile('max(0, -1.12, 1.12)')().should.eql(1.12)
      C.compile('max(-1.12, 0, 1.12)')().should.eql(1.12)
      C.compile('max(1.12, -1.12, 0)')().should.eql(1.12)
    })
    it('max(0.123456789, 0.123456788, 0.1234567885) = 0.123456789', () => {
      C(0.123456789).max(0.123456788).max(0.1234567885).v().should.eql(0.123456789)
      C(0.123456788).max(0.123456789).max(0.1234567885).v().should.eql(0.123456789)
      C(0.1234567885).max(0.123456788).max(0.123456789).v().should.eql(0.123456789)
      C.compile('max(0.123456789, 0.123456788, 0.1234567885)')().should.eql(0.123456789)
      C.compile('max(0.123456788, 0.123456789, 0.1234567885)')().should.eql(0.123456789)
      C.compile('max(0.1234567885, 0.123456788, 0.123456789)')().should.eql(0.123456789)
    })
    it('max(-0.123456789, -0.123456788, -0.1234567885) = -0.123456788', () => {
      C(-0.123456789).max(-0.123456788).max(-0.1234567885).v().should.eql(-0.123456788)
      C(-0.123456788).max(-0.123456789).max(-0.1234567885).v().should.eql(-0.123456788)
      C(-0.1234567885).max(-0.123456788).max(-0.123456789).v().should.eql(-0.123456788)
      C.compile('max(-0.123456789, -0.123456788, -0.1234567885)')().should.eql(-0.123456788)
      C.compile('max(-0.123456788, -0.123456789, -0.1234567885)')().should.eql(-0.123456788)
      C.compile('max(-0.1234567885, -0.123456788, -0.123456789)')().should.eql(-0.123456788)
    })
  })

  describe('min()', () => {
    it('min(1, 2) = 1', () => {
      C(1).min(2).v().should.eql(1)
      C(2).min(1).v().should.eql(1)
      C.compile('min(1, 2)')().should.eql(1)
      C.compile('min(2, 1)')().should.eql(1)
    })
    it('min(3.1, 1.1, 2.1) = 1.1', () => {
      C(3.1).min(1.1).min(2.1).v().should.eql(1.1)
      C(3.1).min(2.1).min(1.1).v().should.eql(1.1)
      C(1.1).min(2.1).min(3.1).v().should.eql(1.1)
      C(2.1).min(1.1).min(3.1).v().should.eql(1.1)
      C.compile('min(3.1, 1.1, 2.1)')().should.eql(1.1)
      C.compile('min(1.1, 3.1, 2.1)')().should.eql(1.1)
      C.compile('min(1.1, 2.1, 3.1)')().should.eql(1.1)
    })
    it('min(1.12, 1.1, 1.113) = 1.1', () => {
      C(1.12).min(1.1).min(1.113).v().should.eql(1.1)
      C(1.1).min(1.12).min(1.113).v().should.eql(1.1)
      C(1.113).min(1.12).min(1.1).v().should.eql(1.1)
      C(1.113).min(1.1).min(1.12).v().should.eql(1.1)
      C.compile('min(1.12, 1.113, 1.1)')().should.eql(1.1)
      C.compile('min(1.1, 1.12, 1.113)')().should.eql(1.1)
      C.compile('min(1.1, 1.113, 1.12)')().should.eql(1.1)
    })
    it('min(0, -1.12, 1.12) = -1.12', () => {
      C(0).min(-1.12).min(1.12).v().should.eql(-1.12)
      C(0).min(1.12).min(-1.12).v().should.eql(-1.12)
      C(1.12).min(-1.12).min(0).v().should.eql(-1.12)
      C(-1.12).min(0).min(1.12).v().should.eql(-1.12)
      C.compile('min(0, -1.12, 1.12)')().should.eql(-1.12)
      C.compile('min(-1.12, 0, 1.12)')().should.eql(-1.12)
      C.compile('min(1.12, -1.12, 0)')().should.eql(-1.12)
    })
    it('min(0.123456789, 0.123456788, 0.1234567885) = 0.123456788', () => {
      C(0.123456789).min(0.123456788).min(0.1234567885).v().should.eql(0.123456788)
      C(0.123456788).min(0.123456789).min(0.1234567885).v().should.eql(0.123456788)
      C(0.1234567885).min(0.123456788).min(0.123456789).v().should.eql(0.123456788)
      C.compile('min(0.123456789, 0.123456788, 0.1234567885)')().should.eql(0.123456788)
      C.compile('min(0.123456788, 0.123456789, 0.1234567885)')().should.eql(0.123456788)
      C.compile('min(0.1234567885, 0.123456788, 0.123456789)')().should.eql(0.123456788)
    })
    it('min(-0.123456789, -0.123456788, -0.1234567885) = -0.123456789', () => {
      C(-0.123456789).min(-0.123456788).min(-0.1234567885).v().should.eql(-0.123456789)
      C(-0.123456788).min(-0.123456789).min(-0.1234567885).v().should.eql(-0.123456789)
      C(-0.1234567885).min(-0.123456788).min(-0.123456789).v().should.eql(-0.123456789)
      C.compile('min(-0.123456789, -0.123456788, -0.1234567885)')().should.eql(-0.123456789)
      C.compile('min(-0.123456788, -0.123456789, -0.1234567885)')().should.eql(-0.123456789)
      C.compile('min(-0.1234567885, -0.123456788, -0.123456789)')().should.eql(-0.123456789)
    })
  })

  describe('round()/rv()/upRound()/uv()/evenRound()/ev()/ceil()/cv()/floor()/fv()', () => {
    it('无小数', () => {
      C(3.1415926535).rv(0).should.eql(3)
      C(3.1415926535).rv().should.eql(3)
      C(20).div(0.000005).r(0).v().should.eql(4000000)
      C(20).div(0.000005).r().v().should.eql(4000000)
      C(3.1415926535).uv(0).should.eql(3)
      C(3.1415926535).uv().should.eql(3)
      C(20).div(0.000005).ru(0).v().should.eql(4000000)
      C(20).div(0.000005).ru().v().should.eql(4000000)
      C(-1.23).mul(0.1).ru(2).v().should.eql(-0.12)
      C(-1.25).mul(0.1).ru(2).v().should.eql(-0.13)
      C(3.1415926535).ev(0).should.eql(3)
      C(3.1415926535).ev().should.eql(3)
      C(20).div(0.000005).re(0).v().should.eql(4000000)
      C(20).div(0.000005).re().v().should.eql(4000000)
      C(-1.25).mul(0.1).re(2).v().should.eql(-0.12)
      C(-1.26).mul(0.1).re(2).v().should.eql(-0.13)
      C(3.1415926535).cv(0).should.eql(4)
      C(3.1415926535).cv().should.eql(4)
      C(20).div(0.000005).cv(2).should.eql(4000000)
      C(20).div(0.000005).rc(0).v().should.eql(4000000)
      C(20).div(0.000005).rc().v().should.eql(4000000)
      C(-1.22).mul(0.1).rc(2).v().should.eql(-0.13)
      C(3.1415926535).fv(0).should.eql(3)
      C(3.1415926535).fv().should.eql(3)
      C(20).div(0.000005).rf(0).v().should.eql(4000000)
      C(20).div(0.000005).rf().v().should.eql(4000000)
      C(-1.26).mul(0.1).rf(2).v().should.eql(-0.12)
      C.compile('(20 / 0.000005){R}')().should.eql(4000000)
      C.compile('(20 / 0.000005){RS}')().should.eql('4000000')
      C.compile('(20 / 0.000005){U}')().should.eql(4000000)
      C.compile('(20 / 0.000005){Us}')().should.eql('4000000')
      C.compile('(20 / 0.000005){E}')().should.eql(4000000)
      C.compile('(20 / 0.000005){ES}')().should.eql('4000000')
      C.compile('(20 / 0.000005){C}')().should.eql(4000000)
      C.compile('(20 / 0.000005){Cs}')().should.eql('4000000')
      C.compile('(20 / 0.000005){F}')().should.eql(4000000)
      C.compile('(20 / 0.000005){FS}')().should.eql('4000000')
    })
    it('1位小数', () => {
      C(3.1415926535).rv(1).should.eql(3.1)
      C(3.1415926535).r(1).v().should.eql(3.1)
      C(3.1415926535).uv(1).should.eql(3.1)
      C(3.1415926535).ru(1).v().should.eql(3.1)
      C(3.1415926535).ev(1).should.eql(3.1)
      C(3.1415926535).re(1).v().should.eql(3.1)
      C(3.1415926535).cv(1).should.eql(3.2)
      C(3.1415926535).rc(1).v().should.eql(3.2)
      C(3.1415926535).fv(1).should.eql(3.1)
      C(3.1415926535).rf(1).v().should.eql(3.1)
      C.compile('(3.1415926535){.1R}')().should.eql(3.1)
      C.compile('(3.1415926535){.1U}')().should.eql(3.1)
      C.compile('(3.1415926535){.1E}')().should.eql(3.1)
      C.compile('(3.1415926535){.1C}')().should.eql(3.2)
      C.compile('(3.1415926535){.1F}')().should.eql(3.1)
    })
    it('2位小数', () => {
      C(3.1415926535).rv(2).should.eql(3.14)
      C(3.1415926535).r(2).v().should.eql(3.14)
      C(0.005).r(2).v().should.eql(0.01)
      C(0.0009).r(2).v().should.eql(0)
      C(3.1415926535).uv(2).should.eql(3.14)
      C(3.1415926535).ru(2).v().should.eql(3.14)
      C(0.005).r(2).v().should.eql(0.01)
      C(0.0009).r(2).v().should.eql(0)
      C(3.1415926535).ev(2).should.eql(3.14)
      C(3.1415926535).re(2).v().should.eql(3.14)
      C(0.005).re(2).v().should.eql(0)
      C(0.0051).re(2).v().should.eql(0.01)
      C(0.015).re(2).v().should.eql(0.02)
      C(0.014).re(2).v().should.eql(0.01)
      C(0.0149).re(2).v().should.eql(0.01)
      C(0.0009).re(2).v().should.eql(0)
      C(3.1415926535).cv(2).should.eql(3.15)
      C(3.1415926535).rc(2).v().should.eql(3.15)
      C(0.001).rc(2).v().should.eql(0.01)
      C(0.0009).rc(2).v().should.eql(0.01)
      C(3.1415926535).fv(2).should.eql(3.14)
      C(3.1415926535).rf(2).v().should.eql(3.14)
      C(0.009).rf(2).v().should.eql(0)
      C(0.0009).rf(2).v().should.eql(0)
      C.compile('(3.1415926535){.2R}')().should.eql(3.14)
      C.compile('(3.1415926535){.2U}')().should.eql(3.14)
      C.compile('(3.1415926535){.2E}')().should.eql(3.14)
      C.compile('(3.1415926535){.2C}')().should.eql(3.15)
      C.compile('(3.1415926535){.2F}')().should.eql(3.14)
    })
    it('3位小数', () => {
      C(3.1415926535).rv(3).should.eql(3.142)
      C(3.1415926535).uv(3).should.eql(3.142)
      C(3.1415926535).ev(3).should.eql(3.142)
      C(3.1415926535).cv(3).should.eql(3.142)
      C(3.1415926535).fv(3).should.eql(3.141)
      C.compile('(3.1415926535){.3R}')().should.eql(3.142)
      C.compile('(3.1415926535){.3U}')().should.eql(3.142)
      C.compile('(3.1415926535){.3E}')().should.eql(3.142)
      C.compile('(3.1415926535){.3C}')().should.eql(3.142)
      C.compile('(3.1415926535){.3F}')().should.eql(3.141)
    })
    it('4位小数', () => {
      C(3.1415926535).rv(4).should.eql(3.1416)
      C(3.1415926535).uv(4).should.eql(3.1416)
      C(3.1415926535).ev(4).should.eql(3.1416)
      C(3.1415926535).cv(4).should.eql(3.1416)
      C(3.1415926535).fv(4).should.eql(3.1415)
      C.compile('(3.1415926535){.4R}')().should.eql(3.1416)
      C.compile('(3.1415926535){.4U}')().should.eql(3.1416)
      C.compile('(3.1415926535){.4E}')().should.eql(3.1416)
      C.compile('(3.1415926535){.4C}')().should.eql(3.1416)
      C.compile('(3.1415926535){.4F}')().should.eql(3.1415)
    })
    it('5位小数', () => {
      C(3.1415926535).rv(5).should.eql(3.14159)
      C(3.1415926535).uv(5).should.eql(3.14159)
      C(3.1415926535).ev(5).should.eql(3.14159)
      C(3.1415926535).cv(5).should.eql(3.1416)
      C(3.1415926535).fv(5).should.eql(3.14159)
      C.compile('(3.1415926535){.5R}')().should.eql(3.14159)
      C.compile('(3.1415926535){.5U}')().should.eql(3.14159)
      C.compile('(3.1415926535){.5E}')().should.eql(3.14159)
      C.compile('(3.1415926535){.5C}')().should.eql(3.1416)
      C.compile('(3.1415926535){.5F}')().should.eql(3.14159)
    })
    it('6位小数', () => {
      C(3.1415926535).rv(6).should.eql(3.141593)
      C(3.1415926535).uv(6).should.eql(3.141593)
      C(3.1415926535).ev(6).should.eql(3.141593)
      C(3.1415926535).cv(6).should.eql(3.141593)
      C(3.1415926535).fv(6).should.eql(3.141592)
      C.compile('(3.1415926535){.6R}')().should.eql(3.141593)
      C.compile('(3.1415926535){.6U}')().should.eql(3.141593)
      C.compile('(3.1415926535){.6E}')().should.eql(3.141593)
      C.compile('(3.1415926535){.6C}')().should.eql(3.141593)
      C.compile('(3.1415926535){.6F}')().should.eql(3.141592)
    })
    it('7位小数', () => {
      C(3.1415926535).rv(7).should.eql(3.1415927)
      C(3.1415926535).uv(7).should.eql(3.1415927)
      C(3.1415926535).ev(7).should.eql(3.1415927)
      C(3.14159265).ev(7).should.eql(3.1415926)
      C(3.1415926535).cv(7).should.eql(3.1415927)
      C(3.1415926535).fv(7).should.eql(3.1415926)
      C.compile('(3.1415926535){.7R}')().should.eql(3.1415927)
      C.compile('(3.1415926535){.7U}')().should.eql(3.1415927)
      C.compile('(3.1415926535){.7E}')().should.eql(3.1415927)
      C.compile('(3.14159265){.7E}')().should.eql(3.1415926)
      C.compile('(3.1415926535){.7C}')().should.eql(3.1415927)
      C.compile('(3.1415926535){.7F}')().should.eql(3.1415926)
    })
    it('8位小数', () => {
      C(3.1415926535).rv(8).should.eql(3.14159265)
      C(3.1415926535).uv(8).should.eql(3.14159265)
      C(3.1415926535).ev(8).should.eql(3.14159265)
      C(3.1415926535).cv(8).should.eql(3.14159266)
      C(3.1415926535).fv(8).should.eql(3.14159265)
      C.compile('(3.1415926535){.8R}')().should.eql(3.14159265)
      C.compile('(3.1415926535){.8U}')().should.eql(3.14159265)
      C.compile('(3.1415926535){.8E}')().should.eql(3.14159265)
      C.compile('(3.1415926535){.8C}')().should.eql(3.14159266)
      C.compile('(3.1415926535){.8F}')().should.eql(3.14159265)
    })
    it('9位小数', () => {
      C(3.1415926535).rv(9).should.eql(3.141592654)
      C(3.1415926535).uv(9).should.eql(3.141592654)
      C(3.1415926535).ev(9).should.eql(3.141592654)
      C(3.1415926535).cv(9).should.eql(3.141592654)
      C(3.1415926535).fv(9).should.eql(3.141592653)
    })
    it('10位小数', () => {
      C(3.1415926535).rv(10).should.eql(3.1415926535)
      C(3.1415926535).uv(10).should.eql(3.1415926535)
      C(3.1415926535).ev(10).should.eql(3.1415926535)
      C(3.1415926535).cv(10).should.eql(3.1415926535)
      C(3.1415926535).fv(10).should.eql(3.1415926535)
    })
  })

  describe('format()/fmt()', () => {
    it('456,789', () => {
      C('456789.12').fmt('#,##0').should.eql('456,789')
    })
    it('456,789', () => {
      C('456789').fmt('#,##0').should.eql('456,789')
    })
    it('456789', () => {
      C('456789').fmt('.').should.eql('456789')
    })
    it('456,789', () => {
      C('456789').fmt('#,##0.').should.eql('456,789')
    })
    it('456,789', () => {
      C('456789').fmt('#,##0.00').should.eql('456,789.00')
    })
    it('456,789.10', () => {
      C('456789.1').fmt('#,##0.00').should.eql('456,789.10')
    })
    it('56,789.12', () => {
      C('56789.12').fmt('#,##0.00').should.eql('56,789.12')
    })
    it('6,789.12', () => {
      C('6789.123').fmt('#,##0.00').should.eql('6,789.12')
    })
    it('789.123', () => {
      C('789.123').fmt('#,##0.').should.eql('789.123')
    })
    it('89.1234', () => {
      C('89.1234').fmt('#,##0.').should.eql('89.1234')
    })
    it('9.123', () => {
      C('9.1234').fmt('#,##0.000').should.eql('9.123')
    })
    it('-456,789', () => {
      C('-456789.12').fmt('#,##0').should.eql('-456,789')
    })
    it('-456,789', () => {
      C('-456789').fmt('#,##0').should.eql('-456,789')
    })
    it('-456789', () => {
      C('-456789').fmt('.').should.eql('-456789')
    })
    it('-456,789', () => {
      C('-456789').fmt('#,##0.').should.eql('-456,789')
    })
    it('-456,789', () => {
      C('-456789').fmt('#,##0.00').should.eql('-456,789.00')
    })
    it('-456,789.10', () => {
      C('-456789.1').fmt('#,##0.00').should.eql('-456,789.10')
    })
    it('-56,789.12', () => {
      C('-56789.12').fmt('#,##0.00').should.eql('-56,789.12')
    })
    it('-6,789.12', () => {
      C('-6789.123').fmt('#,##0.00').should.eql('-6,789.12')
    })
    it('-789.123', () => {
      C('-789.123').fmt('#,##0.').should.eql('-789.123')
    })
    it('-89.1234', () => {
      C('-89.1234').fmt('#,##0.').should.eql('-89.1234')
    })
    it('-9.123', () => {
      C('-9.1234').fmt('#,##0.000').should.eql('-9.123')
    })
  })
  
  it('thousands()', () => {
    C('456789.123').thousands().should.eql('456,789.12')
    C('456789.123').thousands(3).should.eql('456,789.123')
    C('456789.123').thousands(4).should.eql('456,789.1230')
  })

  it('currency()', () => {
    C('456789.123').currency('$').should.eql('$456,789.12')
    C('456789.125').currency('$').should.eql('$456,789.13')
    C('456789.125').currency('$', true).should.eql('$+456,789.13');
    C('-456789.125').currency('$', true).should.eql('$-456,789.12');
    C('456789.125').currency('', true).should.eql('+456,789.13');
    C('-456789.125').currency('', true).should.eql('-456,789.12');
  })

  it('signed()', () => {
    C('456789.123').signed('$').should.eql('$+456789.12');
    C('456789.1').signed('$').should.eql('$+456789.10');
    C('456789.123').signed().should.eql('+456789.12');
    C('-456789.125').signed().should.eql('-456789.12');
  })

  it('unsigned()', () => {
    C('456789.123').unsigned('$').should.eql('$456789.12');
    C('456789.1').unsigned('$').should.eql('$456789.10');
    C('456789.123').unsigned().should.eql('456789.12');
    C('-456789.125').unsigned().should.eql('456789.12');
    C('-456789.126').unsigned().should.eql('456789.13');
  })

  describe('debug()', () => {
    it('debug()', (cb) => {
      const fn = (v, p) => {
        v.should.eql(25)
        p.should.eql(6)
        cb()
      }
      C.setDebug(fn)
      C(0.000025).debug();
      C.resetDebug();
    })
  })

  describe('valueOf()', () => {
    it('1 + C(1) = 2', () => {
      (1 + C(1)).should.eql(2)
    })
    it('1 / C(2) = 0.5', () => {
      (1 / C(2)).should.eql(0.5)
    })
    it('2 * C(2) = 4', () => {
      (2 * C(2)).should.eql(4)
    })
  })

  describe('toString()', () => {
    it('`1 + ${C(1)}` = 1 + 1', () => {
      (`1 + ${C(1)}`).should.eql("1 + 1")
    })
  })
  it('toJSON()', () => {
    JSON.stringify({ a: C(3.14) }).should.eql('{"a":3.14}')
  })
  it('inspect()', () => {
    require('util').inspect({ a: C(3.14) }).should.eql('{ a: 3.14 }')
    require('util').inspect(C(3.14)).should.eql('3.14')
  })
  it('isZero()', ()=>{
    C(0).isZero().should.eql(true);
    C(1).isZero().should.eql(false);
    C(-1).isZero().should.eql(false);
  })
  it('positive()', ()=>{
    C(0).positive().should.eql(false);
    C(1).positive().should.eql(true);
    C(-1).positive().should.eql(false);
  })
  it('negative()', ()=>{
    C(0).negative().should.eql(false);
    C(1).negative().should.eql(false);
    C(-1).negative().should.eql(true);
  })
  it('abs()', ()=>{
    C(0).abs().v().should.eql(0);
    C(1).abs().v().should.eql(1);
    C(-1).abs().v().should.eql(1);
  })
  it('Custom value', ()=>{
    C.Calculator.prototype.custom = function (fn) {
      fn.call(this);
      return this;
    };
    C(200000000000).mul(10000000000).custom(function(){
     this._p = 2;
    }).vs().should.eql('20000000000000000000');
    C(200000000000).mul(10000000000).custom(function(){
      this._p = 2;
     }).v().should.eql(20000000000000000000);
     C(213000000000).mul(10000000000).custom(function(){
      this._p = 2;
    }).vs().should.eql('21300000000000000000');
    C(213000000000).mul(10000000000).custom(function(){
      this._p = 2;
    }).v().should.eql(21300000000000000000);
    C(213000000000).mul(10000000000).custom(function(){
      this._p = 23;
    }).vs().should.eql('0.0213');
    C(213000000000).mul(10000000000).custom(function(){
      this._p = -2;
    }).vs().should.eql('213000000000000000000000')
    C(213000000000).mul(10000000000).custom(function(){
      this._p = -2;
    }).v().should.eql(213000000000000000000000)
    

    C(-200000000000).mul(10000000000).custom(function(){
      this._p = 2;
     }).vs().should.eql('-20000000000000000000');
     C(200000000000).mul(-10000000000).custom(function(){
       this._p = 2;
      }).v().should.eql(-20000000000000000000);
      C(-213000000000).mul(10000000000).custom(function(){
       this._p = 2;
     }).vs().should.eql('-21300000000000000000');
     C(213000000000).mul(-10000000000).custom(function(){
       this._p = 2;
     }).v().should.eql(-21300000000000000000);
     C(-213000000000).mul(10000000000).custom(function(){
       this._p = 23;
     }).vs().should.eql('-0.0213');
     C(-213000000000).mul(10000000000).custom(function(){
       this._p = -2;
     }).vs().should.eql('-213000000000000000000000')
     C(213000000000).mul(-10000000000).custom(function(){
       this._p = -2;
     }).v().should.eql(-213000000000000000000000)

     C({
       _v: 213000000000000000000000,
       _p: 10,
     })
  });
  describe('运算优先级', () => {
    it('6 + 3 - 4 * 5 / 2 = -1', () => {
      C(6).add(3).$sub(C(4).mul(5).div(2)).v().should.eql(-1)
      C.compile('6 + 3 - 4 * 5 / 2')().should.eql(-1)
      C.compile('(6 + 3 - 4 * 5 / 2){s}')().should.eql('-1')
    })
    it('(6 + 3 - 4) * 5 / 2 = 12.5', () => {
      C(6).add(3).sub(4).mul(5).div(2).v().should.eql(12.5)
      C.compile('(6 + 3 - 4) * 5 / 2')().should.eql(12.5)
      C.compile('((6 + 3 - 4) * 5 / 2){s}')().should.eql('12.5')
    })
    it('6 + (3 - 4) * 5 / 2 = 3.5', () => {
      C(6).$add(C(3).sub(4).mul(5).div(2)).v().should.eql(3.5)
      C.compile('6 + (3 - 4) * 5 / 2')().should.eql(3.5)
      C.compile('(6 + (3 - 4) * 5 / 2){s}')().should.eql('3.5')
    })
    it('(6 + (3 - 4) * 5) / 2 = 0.5', () => {
      C(6).$add(C(3).sub(4).mul(5)).div(2).v().should.eql(0.5)
      C.compile('(6 + (3 - 4) * 5) / 2')().should.eql(0.5)
      C.compile('((6 + (3 - 4) * 5) / 2){s}')().should.eql('0.5')
    })
    it('(6 + max(3, 4)) = 10', () => {
      C.compile('(6 + max(3, 4))')().should.eql(10)
    })
  })

  describe('Strict mode', ()=>{
    it('Cannot use unknown field', ()=>{
      var data = {};
      (function(){
        C(data.x).add(data.y)
      }).should.throw(/Invalid/);
      (function(){
        C.strict(data.x).add(data.y)
      }).should.throw(/Invalid/);
    })

    it('`$add/$sub/$div/$mul` Cannot use not calculator', ()=>{
      var data = {x: 10};
      (function(){
        C(0).$add(data)
      }).should.throw(/Invalid/);
      (function(){
        C(0).$sub(data)
      }).should.throw(/Invalid/);
      (function(){
        C(0).$mul(data)
      }).should.throw(/Invalid/);
      (function(){
        C(0).$div(data)
      }).should.throw(/Invalid/);
    })
  })
})