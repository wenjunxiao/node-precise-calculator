const inspect = require('util').inspect
const calculator = require('./calculator')
const { compile, build } = require('./compile')
const { format, evenRound, upRound } = require('./utils')

const _pow = Math.pow
const _ceil = Math.ceil
const _floor = Math.floor
const _abs = Math.abs

/**
 * 四舍五入
 */
const ROUND_HALF_UP = 1
/**
 * 银行家算法
 */
const ROUND_HALF_EVEN = 2
/**
 * 向上舍入
 */
const ROUND_HALF_CEIL = 3
/**
 * 向下舍入
 */
const ROUND_HALF_FLOOR = 4


calculator.format = format;

/**
 * 按照银行家算法对值进行指定精度的舍入操作
 * @param {Number|String} v 值
 * @param {Number} precision 精度
 * @returns {Number} 结果
 */
calculator.evenRound = function (v, precision) {
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
/**
 * 按照四舍五入对值进行指定精度的舍入操作
 * @param {Number|String} v 值
 * @param {Number} precision 精度
 * @returns {Number} 结果
 */
calculator.upRound = function (v, precision) {
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
/**
 * 对值进行向上舍入操作
 * @param {Number|String} v 值
 * @param {Number} precision 精度
 * @returns {Number} 结果
 */
calculator.ceil = function (v, precision) {
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
/**
 * 对值进行向下舍入操作
 * @param {Number|String} v 值
 * @param {Number} precision 精度
 * @returns {Number} 结果
 */
calculator.floor = function (v, precision) {
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

calculator.max = function (v, ...args) {
  if (v._vi === undefined) {
    v = calculator(v)
  }
  for (let a of args) {
    if (a._vi === undefined) {
      v = v.max(a)
    } else {
      v = v.$max(a)
    }
  }
  return v.v()
}

calculator.$max = function (v, ...args) {
  for (let a of args) {
    v = v.$max(a)
  }
  return v
}

calculator.min = function (v, ...args) {
  if (v._vi === undefined) {
    v = calculator(v)
  }
  for (let a of args) {
    if (a._vi === undefined) {
      v = v.min(a)
    } else {
      v = v.$min(a)
    }
  }
  return v.v()
}

calculator.$min = function (v, ...args) {
  for (let a of args) {
    v = v.$min(a)
  }
  return v
}

calculator.pow = function (x, y) {
  return _pow(x, y)
}

calculator.$pow = function (x, y) {
  if (x._vi !== undefined) {
    x = x.v()
  }
  if (y._vi !== undefined) {
    y = y.v()
  }
  return calculator(_pow(x, y))
}

calculator.abs = function (x) {
  return _abs(x)
}

calculator.$abs = function (x) {
  if (x._vi === undefined) {
    return calculator(_abs(x))
  } else {
    x._vi = _abs(x._vi)
    x._v = null
    return x
  }
}

calculator.round = calculator.upRound
calculator.ROUND_HALF_UP = ROUND_HALF_UP
calculator.ROUND_HALF_EVEN = ROUND_HALF_EVEN
calculator.ROUND_HALF_CEIL = ROUND_HALF_CEIL
calculator.ROUND_HALF_FLOOR = ROUND_HALF_FLOOR

/**
 * @param {Object} options 默认设置
 * @param {Number} options.roundRode 设置默认舍入模式
 */
calculator.setup = function ({
  roundRode
}) {
  switch (roundRode) {
    case ROUND_HALF_UP:
      calculator.round = calculator.upRound
      calculator.Calculator.prototype.r = calculator.Calculator.prototype.ru
      calculator.Calculator.prototype.round = calculator.Calculator.prototype.upRound
      break
    case ROUND_HALF_EVEN:
      calculator.round = calculator.evenRound
      calculator.Calculator.prototype.r = calculator.Calculator.prototype.re
      calculator.Calculator.prototype.round = calculator.Calculator.prototype.evenRound
      break
    case ROUND_HALF_CEIL:
      calculator.round = calculator.ceil
      calculator.Calculator.prototype.r = calculator.Calculator.prototype.rc
      calculator.Calculator.prototype.round = calculator.Calculator.prototype.ceil
      break
    case ROUND_HALF_FLOOR:
      calculator.round = calculator.floor
      calculator.Calculator.prototype.r = calculator.Calculator.prototype.rf
      calculator.Calculator.prototype.round = calculator.Calculator.prototype.floor
      break
  }
}

const CACHE = {};
/**
 * 编译并缓存表达式
 * @param {*} expr 表达式
 * @param  {...any} names 表达式中的变量 
 */
function ccompile (expr, ...names) {
  let fn = CACHE[expr];
  if (!fn) {
    fn = CACHE[expr] = compile(expr, ...names);
  }
  return fn;
}

const O_CACHE = {};
function ocompile (expr) {
  let fn = O_CACHE[expr];
  if (!fn) {
    const names = (expr.replace(/\{[^}]*\}/g, '').match(/(?:^|[^.\w])([_a-zA-Z]\w*)/g) || []).reduce((r, s) => {
      s = s.replace(/^.*?(\w+).*$/, '$1')
      if (r.indexOf(s) < 0) {
        r.push(s)
      }
      return r
    }, [])
    const ff = compile(expr, ...names)
    fn = O_CACHE[expr] = (function (names, args) {
      return this(...names.map(n => args[n]))
    }).bind(ff, names)
    fn.exp = ff.exp
    fn.args = names.join(',')
    fn.toString = function () {
      return `({${this.args}}) => ${this.exp}`
    }
    fn[inspect.custom] = function () {
      return `'${this.toString()}'`
    }
  }
  return fn;
}

calculator.build = build
calculator.compile = compile
calculator.ccompile = ccompile
calculator.cc = ccompile
calculator.ocompile = ocompile
calculator.oc = ocompile
calculator.eval = function (expr, ...nd) {
  const n = nd.slice(0, nd.length / 2)
  const d = nd.slice(nd.length / 2)
  return compile(expr, ...n)(...d)
}

module.exports = calculator