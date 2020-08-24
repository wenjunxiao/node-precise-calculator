const calculator = require('../lib/calculator')
const {
  resetDebug,
  compile,
  $compile
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
      }).should.throw(/\$\(1\)\.add\(1a\)\.v\(\)/)
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
      compile('(3.1415){.P}').exp.should.eql("$(3.1415).mul(100).format('.', '', '%')")
      compile('abs(1 - 2)').exp.should.eql("$.$abs($(1).sub(2)).v()")
    })
    it('debug compile', (cb) => {
      const error = console.error
      console.error = (fmt, ...args) => {
        if (/\[compile\]/.test(fmt)) {
          const exp = args.pop()
          const expr = args.pop()
          expr.should.eql('1 + 1')
          exp.should.eql('$(1).add(1).v()')
          console.error = error
          cb()
        }        
      }
      resetDebug(true)
      compile('1 + 1')
      resetDebug(false)
    })
    it('inspect compile result', () => {
      require('util').inspect(compile('1 + 1')).should.eql("'() => $(1).add(1).v()'")
    })
    it('special compile', () => {
      compile('(3.1415).round(2)').exp.should.eql("$(3.1415).r(2).v()");
      (function(){
        compile('(3.1415).test(2)')
      }).should.throw(/Unsupported format alias/)
    })
  })

  describe('$compile()', () => {
    it('max(3)', () => {
      $compile('max(3)').exp.should.eql('$.max(3)')
    })
    it('cannot have format', () => {
      (function(){
        $compile('max(3){.2}').exp.should.eql('$.max(3)')
      }).should.throw(/The expression is not allowed/)
    })
  })
})