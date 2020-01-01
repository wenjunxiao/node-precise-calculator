const inspect = require('util').inspect
const calculator = require('./calculator')
const _pow = Math.pow

const GROUP_PREFIX = '__G__' + Date.now()

/**
 * 处理乘除表达式
 * @param {String} expr 表达式
 */
function evalMD (expr) {
  let found = 0
  do {
    found = 0
    expr = expr.replace(/([^*\/\s]+)\s*(\*|\/)\s*([^*\/\s]+)/, function (_, $1, $2, $3) {
      found = 1
      const m = $3[0] === '$' || $3.startsWith(GROUP_PREFIX) ? (
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

/**
 * 处理加减表达式
 * @param {String} expr 表达式
 */
function evalAS (expr, fn = '') {
  const groups = []
  const GROUP_FLAG = GROUP_PREFIX + '__as__' + Date.now() + '__'
  const GROUP_REG = new RegExp(GROUP_FLAG + '(\\d+)', 'g')
  const REG = /((?:(?!\s[+-]\s)[\s\S])+)\s+([+-])\s+((?:(?!\s[+-]\s)[\s\S])+)/
  let count = 0
  let found = 0
  do {
    found = 0
    expr = expr.replace(REG, function (_, $1, $2, $3) {
      found = 1
      count = count + 1
      const m = $2 === '+' ? 'add' : 'sub'
      let exp = $1.trim().replace(GROUP_REG, function (_, $1) {
        return groups[$1]
      })
      if (exp[0] === '$') {
        exp += '.'
      } else {
        exp = `$(${exp}).`
      }
      if ($3[0] === '$' || $3.startsWith(GROUP_PREFIX)) {
        exp += `$${m}(${$3.trim()})`
      } else {
        exp += `${m}(${$3.trim()})`
      }
      groups.push(exp)
      return GROUP_FLAG + (groups.length - 1)
    })
  } while (found)
  expr = expr.replace(GROUP_REG, function (_, $1) {
    return groups[$1]
  })
  if (count > 0 || expr[0] === '$' && !fn) {
    return expr
  } else if (fn) {
    if (expr.indexOf('$') < 0) {
      return `$.${fn}(${expr})`
    }
    return `$.$${fn}(${expr})`
  } else {
    return `$(${expr})`
  }
}

function evalArgs (s) {
  const arr = s.split(/\s*,\s*/)
  if (arr.length > 1) {
    return arr.map(s => evalAS(evalMD(s))).join(',')
  }
  return s
}

/**
 * 将表达式构建成计算器表达式
 * @param {String} expr 表达式
 */
function build (expr) {
  if (/([\)\d]+([\+\-\*\/])\s*[\(\d]+)/.test(expr) || /([\)\d]+\s*([\+\-\*\/])[\(\d]+)/.test(expr)) {
    throw new Error(`运算符[${RegExp.$2}]前后必须保留空格:[${RegExp.$1}]`)
  }
  let found = 0
  const groups = []
  const GROUP_FLAG = GROUP_PREFIX + '__' + Date.now() + '__'
  const GROUP_REG = new RegExp(GROUP_FLAG + '(\\d+)', 'g')
  const REG = /(\w*)\(([^()]+)\)(?:\{(?:(\w+\([^)]*\));?)?([\$\¥]?)([#\d]*)(\.?)(\d*)([a-zA-Z]*)([\%]?)\})?/g
  do {
    found = 0
    expr = expr.replace(REG, function (_, $f, $exp, $debug, $prefix, $fmt, $dot, $prec, $mode, $suffix) {
      found = 1
      const s = evalArgs($exp).replace(GROUP_REG, function (_, $1) {
        return groups[$1]
      });
      let exp = evalAS(evalMD(s), $f);
      if ($debug) {
        exp += '.' + $debug
      }
      if ($mode) {
        const m = {
          'R': 'r',
          'U': 'ru',
          'E': 're',
          'C': 'rc',
          'F': 'rf',
          'S': 'vs',
          's': 'vs',
          'e': 've'
        }[$mode[0]]
        if (!m) {
          throw new Error('无效的舍入方法[' + $mode + ']')
        }
        if (/^0+$/.test($prec)) {
          $prec = $prec.length
        }
        if ($fmt || $prefix || $suffix) { // 格式化
          if (m !== 'vs' && m !== 've') {
            exp += '.' + m + `(${$prec})`
          }
          if ($prec > 0) {
            $prec = _pow(2, $prec).toString(2).substr(1)
          }
          if ($fmt > 0) {
            let l = Number($fmt) - 1
            $fmt = '0'
            while ((l--) > 0) {
              $fmt = '#' + $fmt
            }
          }
          exp += `.format('${$fmt}${$dot}${$prec}'`
          if ($suffix) {
            exp += `, '${$prefix || ''}', '${$suffix}'`
          } else if ($prefix) {
            exp += `, '${$prefix}'`
          }
          exp += ')'
        } else {
          if (m !== 'vs' && m != 've') {
            exp += '.' + m + `(${$prec})`
          } else if ($prec) {
            exp += `.r(${$prec}).${m}()`
          } else {
            exp += `.${m}()`
          }
          if ($mode.length > 1 && m !== 'vs' && m !== 've') {
            if (!/^\w[sSe]/.test($mode)) {
              throw new Error('无效的舍入方法[' + $mode[1] + ']')
            }
            exp += '.vs()'
          }
        }
      } else if ($fmt || $prec || $prefix || $suffix) {
        if ($prec > 0) {
          $prec = _pow(2, Number($prec)).toString(2).substr(1)
        }
        if (/^\d+$/.test($fmt) && $fmt > 0) {
          let l = Number($fmt) - 1
          $fmt = '0'
          while ((l--) > 0) {
            $fmt = '#' + $fmt
          }
        }
        exp += `.format('${$fmt}${$dot}${$prec}'`
        if ($suffix) {
          exp += `, '${$prefix || ''}', '${$suffix}'`
        } else if ($prefix) {
          exp += `, '${$prefix}'`
        }
        exp += ')'
      }
      groups.push(exp)
      return GROUP_FLAG + (groups.length - 1)
    })
  } while (found)
  return evalAS(evalMD(expr.replace(GROUP_REG, function (_, $1) {
    return groups[$1]
  })))
}

/**
 * 编译表达式
 * @param {String} expr 表达式
 * @param {String[]} names 传入表达式中的参数名称列表
 * @returns {Function} 计算函数
 */
function compile (expr, ...names) {
  let exp = build(expr)
  if (!/\.(f|format|v|vs|ve)\([^)]*\)$/.test(exp)) {
    exp += '.v()'
  }
  try {
    const fn = (new Function('$', ...names, 'return ' + exp)).bind(calculator, calculator)
    fn.toString = function () {
      return `(${this.args}) => ${this.exp}`
    }
    fn[inspect.custom] = function () {
      return `'${this.toString()}'`
    }
    fn.args = names.join(',')
    fn.exp = exp
    if (process.env.DEBUG_CALCULATOR_COMPILE) {
      console.error('[compile] %s -> %s', expr, exp)
    }
    return fn
  } catch (err) {
    err.exp = exp
    err.message += ': ' + exp
    throw err
  }
}

module.exports = {
  evalAS,
  evalMD,
  build,
  compile
}