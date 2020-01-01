const calculator = require('../lib/calculator')
const {
  compile
} = require('../lib/compile')

describe('compile ::', function () {
  describe('compile()', () => {
    it('max(3)', () => {
      compile('max(3)').exp.should.eql('$.max(3).v()')
    })

    it('1 + max(2, 3, 1)', () => {
      const fn = compile('1 + max(2, 3, 1)')
      fn.exp.should.eql('$(1).$add($.$max($(2),$(3),$(1))).v()')
      fn().should.eql(4)
    })

    it('(1 + max(2, 3, 1)){debug();}', () => {
      calculator.setDebug(() => {
      })
      const fn = compile('(1 + max(2, 3, 1)){debug();}')
      fn.exp.should.eql('$(1).$add($.$max($(2),$(3),$(1))).debug().v()')
      fn().should.eql(4)
      calculator.resetDebug()
    })

    it('invalid expression without space around operator `1+1`', () => {
      (function () {
        compile('1+1')
      }).should.throw(new Error('运算符[+]前后必须保留空格:[1+1]'))
    })

    it('invalid argument `1+1`', () => {
      (function () {
        compile('1 + 1a', '1a')
      }).should.throw(/Invalid or unexpected token/)
    })

    it('invalid round', () => {
      (function () {
        compile('(1 + 1){r}')
      }).should.throw(/无效的舍入方法/)
    })
    it('invalid double round', () => {
      (function () {
        compile('(1 + 1){RR}')
      }).should.throw(/无效的舍入方法/)
    })

    it('compile format', () => {
      compile('(3.1415){##0.00s}').exp.should.eql("$(3.1415).format('##0.00')")
      compile('(3.1415){##0s}').exp.should.eql("$(3.1415).format('##0')")
      compile('(3.1415){##0.0s}').exp.should.eql("$(3.1415).format('##0.0')")
      compile('(3.1415){3.00s}').exp.should.eql("$(3.1415).format('##0.00')")
      compile('(3.1415){3.2s}').exp.should.eql("$(3.1415).format('##0.00')")
      compile('(3.1415){.00s}').exp.should.eql("$(3.1415).r(2).vs()")
      compile('(3.1415){.2s}').exp.should.eql("$(3.1415).r(2).vs()")
      compile('(3.1415){3.2R}').exp.should.eql("$(3.1415).r(2).format('##0.00')")
      compile('(3.1415){3.2}').exp.should.eql("$(3.1415).format('##0.00')")
      compile('(3.1415){3.00}').exp.should.eql("$(3.1415).format('##0.00')")
      compile('(3.1415){##0.00}').exp.should.eql("$(3.1415).format('##0.00')")
      compile('(3.1415){$##0.00s}').exp.should.eql("$(3.1415).format('##0.00', '$')")
      compile('(3.1415){$##0.00}').exp.should.eql("$(3.1415).format('##0.00', '$')")
      compile('(1234.567){$##0.00s}')().should.eql("$1,234.56")
      compile('(1234.567){$##0.00R}')().should.eql("$1,234.57")
      compile('(3.1415){##0.00s%}').exp.should.eql("$(3.1415).format('##0.00', '', '%')")
      compile('(3.1415){##0.00%}').exp.should.eql("$(3.1415).format('##0.00', '', '%')")
      compile('(1234.567){##0.00s%}')().should.eql("1,234.56%")
      compile('(1234.567){##0.00R%}')().should.eql("1,234.57%")
      compile('(3.1415){$##0.00s%}').exp.should.eql("$(3.1415).format('##0.00', '$', '%')")
      compile('(1234.567){$##0.00s%}')().should.eql("$1,234.56%")
      compile('(1234.567){$##0.00R%}')().should.eql("$1,234.57%")
    })
    it('debug compile', (cb) => {
      process.env.DEBUG_CALCULATOR_COMPILE = true
      const error = console.error
      console.error = (...args) => {
        const exp = args.pop()
        const expr = args.pop()
        expr.should.eql('1 + 1')
        exp.should.eql('$(1).add(1).v()')
        console.error = error
        cb()
      }
      compile('1 + 1')
      delete process.env.DEBUG_CALCULATOR_COMPILE
    })

    it('inspect compile result', () => {
      require('util').inspect(compile('1 + 1')).should.eql("'() => $(1).add(1).v()'")
    })
  })
})