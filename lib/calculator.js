const _pow = Math.pow
const _floor = Math.floor
const _round = Math.round
const _max = Math.max
const _ceil = Math.ceil

/**
 * 银行家舍入
 * @param {*} v 
 * @param {*} p
 * @param {*} precision 
 */
function evenRound(v, p, precision) {
  if (p > precision) {
    const m = _pow(10, precision)
    const n = v / _pow(10, p - precision)
    const i = _floor(n)
    const f = n - i
    const e = 1e-8
    const r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : _round(n)
    return r / m
  } else if (precision) {
    const m = _pow(10, precision)
    const n = v * _pow(10, precision - p)
    const i = _floor(n)
    const f = n - i
    const e = 1e-8
    const r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : _round(n)
    return r / m
  } else {
    const n = v / _pow(10, p)
    const i = _floor(n)
    const f = n - i
    const e = 1e-8
    return (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : _round(n)
  }
}

/**
 * 四舍五入
 * @param {*} v 
 * @param {*} p
 * @param {*} precision 
 */
function upRound(v, p, precision) {
  if (precision) {
    return _round(v * _pow(10, precision - p)) / _pow(10, precision)
  } else {
    return _round(v / _pow(10, p))
  }
}

const ROUND_HALF_UP = 1
const ROUND_HALF_EVEN = 2
const ROUND_HALF_CEIL = 3
const ROUND_HALF_FLOOR = 4

class Calculator {

  constructor(v) {
    const s = v.toString()
    this._v = s
    const p = s.indexOf('.')
    if (p < 0) {
      this._vi = Number(v)
      this._p = 0
    } else {
      this._vi = Number(s.substr(0, p) + s.substr(p + 1))
      this._p = s.length - p - 1
    }
  }

  /**
   * `+`
   */
  add(v) {
    if (v) {
      const s = v.toString()
      const pos = s.indexOf('.')
      let _p = 0
      let _vi
      if (pos < 0) {
        _vi = Number(v)
      } else {
        _vi = Number(s.substr(0, pos) + s.substr(pos + 1))
        _p = s.length - pos - 1
      }
      if (_p > this._p) {
        this._vi = this._vi * _pow(10, _p - this._p) + _vi
        this._p = _p
      } else {
        this._vi = this._vi + _vi * _pow(10, this._p - _p)
      }
      this._v = null
    }
    return this
  }

  $add(v) {
    if (v._p > this._p) {
      this._vi = this._vi * _pow(10, v._p - this._p) + v._vi
      this._p = v._p
    } else {
      this._vi = this._vi + v._vi * _pow(10, this._p - v._p)
    }
    this._v = null
    return this
  }

  /**
   * `-`
   */
  sub(v) {
    if (v) {
      const s = v.toString()
      const pos = s.indexOf('.')
      let _p = 0
      let _vi
      if (pos < 0) {
        _vi = Number(v)
      } else {
        _vi = Number(s.substr(0, pos) + s.substr(pos + 1))
        _p = s.length - pos - 1
      }
      if (_p > this._p) {
        this._vi = this._vi * _pow(10, _p - this._p) + _vi
        this._p = _p
      } else {
        this._vi = this._vi - _vi * _pow(10, this._p - _p)
      }
      this._v = null
    }
    return this
  }

  $sub(v) {
    if (v._p > this._p) {
      this._vi = this._vi * _pow(10, v._p - this._p) + v._vi
      this._p = v._p
    } else {
      this._vi = this._vi - v._vi * _pow(10, this._p - v._p)
    }
    this._v = null
    return this
  }

  /**
   * `*`
   */
  mul(v) {
    const s = v.toString()
    const pos = s.indexOf('.')
    let _p = 0
    let _vi
    if (pos < 0) {
      _vi = Number(v)
    } else {
      _vi = Number(s.substr(0, pos) + s.substr(pos + 1))
      _p = s.length - pos - 1
    }
    this._vi = this._vi * _vi
    this._p = this._p + _p
    this._v = null
    return this
  }

  $mul(v) {
    this._vi = this._vi * v._vi
    this._p = this._p + v._p
    this._v = null
    return this
  }

  /**
   * `/`
   */
  div(v) {
    const s = v.toString()
    const pos = s.indexOf('.')
    let _p = 0
    let _vi
    if (pos < 0) {
      _vi = Number(v)
    } else {
      _vi = Number(s.substr(0, pos) + s.substr(pos + 1))
      _p = s.length - pos - 1
    }
    this._vi = this._vi / _vi
    this._p = this._p - _p
    this._v = null
    return this
  }

  $div(v) {
    this._vi = this._vi / v._vi
    this._p = this._p - v._p
    this._v = null
    return this
  }

  v() {
    if (this._v === null) {
      this._v = (this._vi * _pow(10, this._p)).toString()
    }
    return this._v
  }

  rv(precision) {
    return this.round(precision)
  }

  uv(precision) {
    return this.round(precision)
  }

  ev(precision) {
    return this.evenRound(precision)
  }

  r(precision) {
    this._v = this.round(precision)
    return this
  }

  ru(precision) {
    this._v = this.upRound(precision)
    return this
  }

  re(precision) {
    this._v = this.evenRound(precision)
    return this
  }

  rc(precision) {
    this._v = this.ceil(precision)
    return this
  }

  rf(precision) {
    this._v = this.floor(precision)
    return this
  }

  round(precision) {
    return evenRound(this._vi, this._p, precision)
  }

  upRound(precision) {
    return upRound(this._vi, this._p, precision)
  }

  evenRound(precision) {
    return evenRound(this._vi, this._p, precision)
  }

  ceil(precision) {
    if (this._p > precision) {
      const m = _pow(10, this._p - precision)
      return _ceil(this._vi / m) / _pow(10, precision)
    } else {
      return this._vi / _pow(10, this._p)
    }
  }

  floor(precision) {
    if (this._p > precision) {
      const m = _pow(10, this._p - precision)
      return _floor(this._vi / m) / _pow(10, precision)
    } else {
      return this._vi / _pow(10, this._p)
    }
  }
}

Calculator.evenRound = function (v, precision) {
  const s = v.toString()
  const p = s.indexOf('.')
  if (p < 0) {
    const _vi = Number(v)
    return evenRound(_vi, 0, precision)
  } else {
    const _vi = Number(s.substr(0, p) + s.substr(p + 1))
    return evenRound(_vi, s.length - p - 1, precision)
  }
}

Calculator.upRound = function (v, precision) {
  const s = v.toString()
  const p = s.indexOf('.')
  if (p < 0) {
    const _vi = Number(v)
    return upRound(_vi, 0, precision)
  } else {
    const _vi = Number(s.substr(0, p) + s.substr(p + 1))
    return upRound(_vi, s.length - p - 1, precision)
  }
}

Calculator.ceil = function (v, precision) {
  const s = v.toString()
  const p = s.indexOf('.')
  if (p < 0) {
    return Number(v)
  } else {
    const _p = s.length - p - 1
    const _vi = Number(s.substr(0, p) + s.substr(p + 1))
    if (_p > precision) {
      const m = _pow(10, _p - precision)
      return _ceil(_vi / m) / _pow(10, precision)
    }
    return _vi / _pow(10, _p)
  }
}

Calculator.floor = function (v, precision) {
  const s = v.toString()
  const p = s.indexOf('.')
  if (p < 0) {
    return Number(v)
  } else {
    const _p = s.length - p - 1
    const _vi = Number(s.substr(0, p) + s.substr(p + 1))
    if (_p > precision) {
      const m = _pow(10, _p - precision)
      return _floor(_vi / m) / _pow(10, precision)
    }
    return _vi / _pow(10, _p)
  }
}

Calculator.round = Calculator.evenRound
Calculator.ROUND_HALF_UP = ROUND_HALF_UP
Calculator.ROUND_HALF_EVEN = ROUND_HALF_EVEN
Calculator.ROUND_HALF_EVEN = ROUND_HALF_CEIL
Calculator.ROUND_HALF_EVEN = ROUND_HALF_FLOOR
Calculator.setup = function ({
  roundRode
}) {
  switch (roundRode) {
    case ROUND_HALF_UP:
      Calculator.round = Calculator.upRound
      Calculator.prototype.round = Calculator.prototype.upRound
      break
    case ROUND_HALF_EVEN:
      Calculator.round = Calculator.evenRound
      Calculator.prototype.round = Calculator.prototype.evenRound
      break
    case ROUND_HALF_CEIL:
      Calculator.round = Calculator.ceil
      Calculator.prototype.round = Calculator.prototype.ceil
      break
    case ROUND_HALF_FLOOR:
      Calculator.round = Calculator.floor
      Calculator.prototype.round = Calculator.prototype.floor
      break
  }
}

Calculator.calc = Calculator.$ = function (v) {
  return new Calculator(v)
}

function evalMD(expr) {
  let found = 0
  do {
    found = 0
    expr = expr.replace(/([^*\/\s]+)\s*(\*|\/)\s*([^*\/\s]+)/, function (_, $1, $2, $3) {
      found = 1
      const m = $3[0] === '$' ? (
        $2 === '*' ? '$mul' : '$div'
      ) : (
        $2 === '*' ? 'mul' : 'div'
      )
      if ($1[0] === '$') {
        return $1 + `.${m}(${$3})`
      } else {
        return `$(${$1}).${m}(${$3})`
      }
    })
  } while (found)
  return expr
}

function evalAS(expr) {
  let found = 0
  do {
    found = 0
    expr = expr.replace(/(\S+)\s+(\+|\-)\s+(\S+)/, function (_, $1, $2, $3) {
      found = 1
      const m = $3[0] === '$' ? (
        $2 === '+' ? '$add' : '$sub'
      ) : (
        $2 === '+' ? 'add' : 'sub'
      )
      if ($1[0] === '$') {
        return $1 + `.${m}(${$3})`
      } else {
        return `$(${$1}).${m}(${$3})`
      }
    })
  } while (found)
  return expr
}

function build(expr) {
  let found = 0
  const groups = []
  do {
    found = 0
    expr = expr.replace(/\(([^()]+)\)(?:\{\.(\d+)([a-z]?)\})?/g, function (_, $1, $2, $3) {
      found = 1
      const s = $1.replace(/\$G(\d+)/g, function (_, $1) {
        return groups[$1]
      })
      if ($2) {
        const m = {
          'r': 'r',
          'u': 'ru',
          'e': 're',
          'c': 'rc',
          'f': 'rf'
        } [$3] || 'r'
        groups.push(evalAS(evalMD(s)) + '.' + m + `(${$2})`)
      } else {
        groups.push(evalAS(evalMD(s)))
      }
      return '$G' + (groups.length - 1)
    })
  } while (found)
  return evalAS(evalMD(expr.replace(/\$G(\d+)/g, function (_, $1) {
    return groups[$1]
  })))
}

/**
 * 编译表达式
 * @param {String} expr
 * @param {String} name
 */
function compile(expr, name) {
  return (new Function('$', name, 'return ' + build(expr) + '.v()')).bind(Calculator, function (v) {
    return new Calculator(v)
  })
}

Calculator.build = build
Calculator.compile = compile
Calculator.eval = function (expr, n, d) {
  return compile(expr, n)(d)
}