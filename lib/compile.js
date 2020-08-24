const inspect = require('util').inspect
const calculator = require('./calculator')
const _pow = Math.pow

const GROUP_PREFIX = '__G__' + Date.now()
let debug = () => { }

function resetDebug (enable) {
  if (['true', 'on', true, 1].indexOf(enable) < 0) {
    debug = () => { }
  } else {
    debug = console.error.bind(console)
  }
}

/**
 * 处理乘除表达式
 * @param {String} expr 表达式
 */
function evalMD (expr) {
  let found = 0
  do {
    found = 0
    expr = expr.replace(/([^*\/\s]+)\s*(\*|\/)\s*([^*\/\s]+)/, function (_, $1, $2, $3) {
      debug('[evalMD] %s %s %s', $1, $2, $3)
      found = 1
      const m = /^\$(\.\$|[^.])/.test($3) || $3.startsWith(GROUP_PREFIX) ? (
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
      debug('[evalAS] %s %s %s', $1, $2, $3)
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
      if (/^\$(\.\$|[^.])/.test($3) || $3.startsWith(GROUP_PREFIX)) {
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
    if (fn) {
      return `$.$${fn}(${expr})`
    }
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
    return arr.map(s => {
      debug('[evalArgs] %s', s)
      return evalAS(evalMD(s))
    }).join(',')
  }
  return s
}

const SPECIAL_ALIAS = {
  round: 'R',
  r: 'R',
  upRound: 'U',
  ru: 'U',
  evenRound: 'E',
  re: 'E',
  ceil: 'C',
  rc: 'C',
  floor: 'F',
  rf: 'F'
};

/**
 * 将表达式构建成计算器表达式
 * @param {String} expr 表达式
 */
function build (expr) {
  if (/([\)\d]+([\+\-\*\/])\s*[\(\d]+)/.test(expr) || /([\)\d]+\s*([\+\-\*\/])[\(\d]+)/.test(expr)) {
    throw new Error(`运算符[${RegExp.$2}]前后必须保留空格:[${RegExp.$1}]`)
  }
  // 支持前置货币和特殊函数
  expr = expr.replace(/^([\$\¥]?)(.*)(%?)$/, '($2){$1.$3}').replace(/\)\.(\w+)\(\s*(\d*)\s*\)/mg, ($0, $1, $2) => {
    const v = SPECIAL_ALIAS[$1];
    if (!v) throw new Error('Unsupported format alias: ' + $1);
    return `){.${$2}${v}}`;
  });
  let found = 0
  const groups = []
  const GROUP_FLAG = GROUP_PREFIX + '__' + Date.now() + '__'
  const GROUP_REG = new RegExp(GROUP_FLAG + '(\\d+)', 'g')
  const REG = /(\w*)\(([^()]+)\)(?:\{(?:(\w+\([^)]*\));?)?([\$\¥]?)([#\d]*)(\.?)(\d*)([a-zA-Z]*)([\%]?)\})?/g
  do {
    found = 0
    expr = expr.replace(REG, function (_, $f, $exp, $debug, $prefix, $fmt, $dot, $prec, $mode, $suffix) {
      found = 1
      debug('[build] %s(%s)', $f, $exp)
      const s = evalArgs($exp).replace(GROUP_REG, function (_, $1) {
        return groups[$1]
      });
      let exp = evalAS(evalMD(s), $f);
      if ($debug) {
        exp += '.' + $debug
      }
      if ($mode) {
        const m = {
          'P': 'mul(100)',
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
        if ($mode[0] === 'P') {
          $suffix = $suffix || '%'
        }
        if (/^0+$/.test($prec)) {
          $prec = $prec.length
        }
        if ($fmt || $prefix || $suffix) { // 格式化
          if (/\(.*\)/.test(m)) {
            exp += '.' + m
          } else if (m !== 'vs' && m !== 've') {
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
 * 
 * @param {*} final 表达式结果返回最终结果(`Number|String`)还是过程结果(`Calculator`)，
 * 如果表达式中中已经出现指定模式或者格式化`format`等导致产生最终结果，那么返回
 * @param {*} expr 
 * @param  {...any} names 
 * @returns {Function} 计算函数
 */
function _compile (final, expr, ...names) {
  let exp = build(expr)
  if (/\.(f|format|v|vs|ve)\([^)]*\)$/.test(exp)) {
    if (!final) throw new Error(`The expression is not allowed to contain the final result: ${exp}`);
  } else if (final) {
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
    debug('[compile] %s -> %s', expr, exp)
    return fn
  } catch (err) {
    err.exp = exp
    err.args = names
    err.message += `: (${names.join(',')}) => ${exp}`
    throw err
  }
}

function $compile (expr, ...names) {
  return _compile(false, expr, ...names);
}

/**
 * 编译表达式
 * @param {String} expr 表达式
 * @param {String[]} names 传入表达式中的参数名称列表
 * @returns {Function} 计算函数
 */
function compile (expr, ...names) {
  return _compile(true, expr, ...names);
}

module.exports = {
  resetDebug,
  evalAS,
  evalMD,
  build,
  $compile,
  compile
}