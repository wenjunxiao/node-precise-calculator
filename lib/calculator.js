const inspect = require('util').inspect
const { upRound, evenRound, format } = require('./utils')

const _pow = Math.pow
const _ceil = Math.ceil
const _floor = Math.floor
const _round = Math.round
const _abs = Math.abs

/**
 * 计算器
 */
class Calculator {

  /**
   * @param {Number|String|Calculator} v 初始化值
   */
  constructor(v) {
    if (v) {
      if (v._vi === undefined) {
        const s = v.toString()
        const pe = s.lastIndexOf('e')
        if (pe > 0) { // 科学计数法
          this._p = 0 - Number(s.slice(pe + 1))
          const p = s.indexOf('.')
          if (p < 0) {
            this._vi = Number(s.slice(0, pe))
          } else {
            this._p += pe - p - 1
            if (this._p < 0) {
              this._vi = Number(s) * _pow(10, this._p)
            } else {
              this._vi = Number(s.slice(0, p) + s.slice(p + 1, pe))
            }
          }
          this._v = null
        } else {
          const p = s.indexOf('.')
          if (p < 0) {
            this._vi = this._v = Number(v)
            this._p = 0
          } else {
            this._vi = Number(s.substr(0, p) + s.substr(p + 1))
            this._p = s.length - p - 1
            this._v = null
          }
        }
      } else {
        this._vi = v._vi
        this._p = v._p
        this._v = v._v
      }
    } else {
      this._vi = 0
      this._p = 0
      this._v = null
    }
  }

  /**
   * 普通加法`+`
   * @param {Number|String} v 加数
   * @returns {Calculator} this
   */
  add (v) {
    if (v) {
      const s = v.toString()
      const pe = s.indexOf('e')
      let _p = 0
      let _vi
      if (pe > 0) {
        _p = -Number(s.slice(pe + 1))
        const p = s.indexOf('.')
        if (p < 0) {
          _vi = Number(s.slice(0, pe))
        } else {
          _vi = Number(s.slice(0, p) + s.slice(p + 1, pe))
          _p += pe - p - 1
        }
      } else {
        const pos = s.indexOf('.')
        if (pos < 0) {
          _vi = Number(v)
        } else {
          _vi = Number(s.substr(0, pos) + s.substr(pos + 1))
          _p = s.length - pos - 1
        }
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

  /**
   * 复合加法`+`
   * @param {Calculator} v 表达式加数
   */
  $add (v) {
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
   * 普通减法`-`
   * @param {Number|String} v 减数
   */
  sub (v) {
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
        this._vi = this._vi * _pow(10, _p - this._p) - _vi
        this._p = _p
      } else {
        this._vi = this._vi - _vi * _pow(10, this._p - _p)
      }
      this._v = null
    }
    return this
  }

  /**
   * 复合减法`-`
   * @param {Calculator} v 复合减数
   * @returns {Calculator} this
   */
  $sub (v) {
    if (v._p > this._p) {
      this._vi = this._vi * _pow(10, v._p - this._p) - v._vi
      this._p = v._p
    } else {
      this._vi = this._vi - v._vi * _pow(10, this._p - v._p)
    }
    this._v = null
    return this
  }

  /**
   * 普通乘法`*`
   * @param {Number|String} v 乘数
   * @returns {Calculator} this
   */
  mul (v) {
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
      this._vi = this._vi * _vi
      this._p = this._p + _p
    } else {
      this._vi = 0
      this._p = 0
    }
    this._v = null
    return this
  }

  /**
   * 复合乘法`*`
   * @param {Calculator} v 复合乘数
   * @returns {Calculator} this
   */
  $mul (v) {
    this._vi = this._vi * v._vi
    this._p = this._p + v._p
    this._v = null
    return this
  }

  /**
   * 普通除法`/`
   * @param {Number|String} v 除数
   * @returns {Calculator} this
   */
  div (v) {
    if (v) {
      let s = v.toString()
      let pe = s.indexOf('e')
      let _p = 0
      let _vi
      if (pe > 0) { // 科学计数
        _p = -Number(s.slice(pe + 1))
        const p = s.indexOf('.')
        if (p < 0) {
          _vi = Number(s.slice(0, pe))
        } else {
          _vi = Number(s.slice(0, p) + s.slice(p + 1, pe))
          _p += pe - p - 1
        }
      } else {
        const pos = s.indexOf('.')
        if (pos < 0) {
          _vi = Number(v)
        } else {
          _vi = Number(s.substr(0, pos) + s.substr(pos + 1))
          _p = s.length - pos - 1
        }
      }
      this._vi = this._vi / _vi
      s = this._vi.toString()
      pe = s.indexOf('e') // 除完之后是否有科学计数
      if (pe < 0) {
        const pos = s.indexOf('.')
        if (pos > 0) {
          this._vi = Number(s.substr(0, pos) + s.substr(pos + 1))
          this._p = this._p - _p + s.length - pos - 1
        } else {
          this._p -= _p
        }
      } else {
        const e = Number(s.substr(pe + 1))
        const pos = s.indexOf('.')
        // assert.ok(pos > 0, '不带0整数相除不会产生没有小数的科学计数')
        // if (pos < 0) {
        //   this._vi = Number(s.substr(0, pe))
        //   this._p = this._p - _p - e
        // }
        this._vi = Number(s.substr(0, pos) + s.substring(pos + 1, pe))
        this._p = this._p - _p + pe - pos - 1 - e
      }
    } else {
      this._vi = Infinity
      this._p = 0
    }
    this._v = null
    return this
  }

  /**
   * 复合除法`/`
   * @param {Calculator} v 复合除数
   * @returns {Calculator} this
   */
  $div (v) {
    this._vi = this._vi / v._vi
    let s = this._vi.toString()
    const pe = s.indexOf('e')
    if (pe < 0) {
      let pos = s.indexOf('.')
      if (pos < 0) {
        this._p = this._p - v._p
      } else {
        // // 去掉小数末尾的0
        // let i = s.length - 1;
        // while (i > pos && s[i] === '0') i--;
        // i++;
        this._vi = Number(s.substr(0, pos) + s.substr(pos + 1))
        this._p = this._p - v._p + s.length - pos - 1
      }
    } else {
      const e = Number(s.substr(pe + 1))
      const pos = s.indexOf('.')
      // assert.ok(pos > 0, '不带0整数相除不会产生没有小数的科学计数')
      // if (pos < 0) {
      //   this._p = this._p - v._p - e
      // }
      this._vi = Number(s.substr(0, pos) + s.substring(pos + 1, pe))
      this._p = this._p - v._p + pe - pos - 1 - e
    }
    this._v = null
    return this
  }

  max (v) {
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
    if (this._p > _p) {
      let _di = _vi * _pow(10, this._p - _p)
      if (_di > this._vi) {
        this._p = _p
        this._vi = _vi
        this._v = null
      }
    } else {
      let _di = this._vi * _pow(10, _p - this._p)
      if (_vi > _di) {
        this._p = _p
        this._vi = _vi
        this._v = null
      }
    }
    return this;
  }

  $max (v) {
    if (this._p > v._p) {
      let _di = v._vi * _pow(10, this._p - v._p)
      if (_di > this._vi) {
        return v
      }
    } else {
      let _di = this._vi * _pow(10, v._p - this._p)
      if (v._vi > _di) {
        return v
      }
    }
    return this
  }

  min (v) {
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
    if (this._p > _p) {
      let _di = _vi * _pow(10, this._p - _p)
      if (_di < this._vi) {
        this._p = _p
        this._vi = _vi
        this._v = null
      }
    } else {
      let _di = this._vi * _pow(10, _p - this._p)
      if (_vi < _di) {
        this._p = _p
        this._vi = _vi
        this._v = null
      }
    }
    return this;
  }

  $min (v) {
    if (this._p > v._p) {
      let _di = v._vi * _pow(10, this._p - v._p)
      if (_di < this._vi) {
        return v
      }
    } else {
      let _di = this._vi * _pow(10, v._p - this._p)
      if (v._vi < _di) {
        return v
      }
    }
    return this
  }

  /**
   * @returns {Number} 当前计算结果
   */
  v () {
    if (this._v === null) {
      if (this._p === 0) {
        this._v = this._vi
      } else {
        this._v = Number(this.vs())
      }
    }
    return this._v
  }

  /**
   * 返回值
   */
  value () {
    return this.v();
  }

  vs () {
    if (this._p > 0) {
      if (this._vi < 0) {
        let s = this._vi.toString()
        let p = this._p - s.length + 1
        if (p < 0) {
          p = 1 - p
          return s.substring(0, p) + '.' + s.substring(p)
        } else {
          s = s.slice(1)
          while ((p--) > 0) {
            s = '0' + s
          }
          return '-0.' + s
        }
      } else {
        let s = this._vi.toString()
        let p = this._p - s.length
        if (p < 0) {
          p = 0 - p
          return s.substring(0, p) + '.' + s.substring(p)
        } else {
          while ((p--) > 0) {
            s = '0' + s
          }
          return '0.' + s
        }
      }
    } else if (this._p < 0) {
      let s = this._vi.toString()
      let p = 0 - this._p
      while ((p--) > 0) {
        s += '0'
      }
      return s
    }
    return this._vi.toString()
  }

  ve () {
    if (this._vi === 0) {
      return this._vi.toString()
    } else {
      let s = this._vi.toString()
      let i = s.length - 1
      let p = (i - this._p).toString()
      while (i > 0 && s[i] === '0') i--;
      i++;
      const sp = s[0] === '-' ? 2 : 1
      if (i > sp) {
        if (p[0] === '-') {
          return s.substr(0, sp) + '.' + s.substr(sp) + 'e' + p
        } else {
          return s.substr(0, sp) + '.' + s.substr(sp) + 'e+' + p
        }
      } else {
        if (p[0] === '-') {
          return s.substr(0, sp) + 'e' + p
        } else {
          return s.substr(0, sp) + 'e+' + p
        }
      }
    }
  }

  /**
   * 按照当前舍入方式(默认四舍五入,可以通过`setup`设置默认的舍入方式)返回指定精度的结果
   * @param {Number} precision 精度
   * @returns {Number} 计算结果
   */
  round (precision = 0) {
    return upRound(this._vi, this._p, precision)
  }
  /**
   * `round`别名
   * @see this.round
   * @param {Number} precision 精度
   * @returns {Number} 计算结果
   */
  rv (precision = 0) {
    return this.round(precision)
  }

  /**
   * 按照四舍五入返回指定精度的结果
   * @param {Number} precision 精度
   * @returns {Number} 计算结果
   */
  upRound (precision = 0) {
    return upRound(this._vi, this._p, precision)
  }

  /**
   * `upRound`别名
   * @see this.upRound
   * @param {Number} precision 精度
   * @returns {Number} 计算结果
   */
  uv (precision = 0) {
    return this.upRound(precision)
  }
  /**
   * 按照银行家算法返回指定精度的结果
   * @param {Number} precision 精度
   * @returns {Number} 计算结果
   */
  evenRound (precision = 0) {
    return evenRound(this._vi, this._p, precision)
  }
  /**
   * `evenRound`别名
   * @see this.evenRound
   * @param {Number} precision 精度
   * @returns {Number} 计算结果
   */
  ev (precision = 0) {
    return this.evenRound(precision)
  }

  /**
   * 按照当前舍入方式(默认四舍五入)对当前计算结果进行舍入操作
   * @param {Number} precision 精度
   * @returns {Calculator} this
   */
  r (precision = 0) {
    return this.ru(precision)
  }

  /**
   * 按照四舍五入对当前计算结果进行舍入操作
   * @param {Number} precision 精度
   * @returns {Calculator} this
   */
  ru (precision = 0) {
    if (this._p > precision) {
      let s = this._vi.toString()
      let p = s.length - this._p + precision // 需要移动的位数
      if (p < 0) {
        this._vi = 0
        this._p = 0
      } else {
        this._vi = Number(s.substr(0, p)) + _round(Number('0.' + s.substr(p)))
        this._p = precision
      }
      this._v = null
    }
    return this
  }

  /**
   * 按照银行家算法对当前计算结果进行舍入操作
   * @param {Number} precision 精度
   * @returns {Calculator} this
   */
  re (precision = 0) {
    if (this._p > precision) {
      let s = this._vi.toString()
      let p = s.length - this._p + precision // 需要移动的位数
      if (p < 0) {
        this._vi = 0
        this._p = 0
      } else {
        this._vi = evenRound(Number(s.substr(0, p) + '.' + s.substr(p)), 0, 0)
        this._p = precision
      }
      this._v = null
    }
    return this
  }

  /**
   * 对当前计算结果进行向上舍入
   * @param {Number} precision 精度
   * @returns {Calculator} this
   */
  rc (precision = 0) {
    if (this._p > precision) {
      let s = this._vi.toString()
      let p = s.length - this._p + precision // 需要移动的位数
      if (p < 0) {
        this._vi = 0
        this._p = 0
      } else {
        this._vi = Number(s.substr(0, p)) + _ceil(Number('0.' + s.substr(p)))
        this._p = precision
      }
      this._v = null
    }
    return this
  }

  /**
   * 对当前计算结果进行向下舍入
   * @param {Number} precision 精度
   * @returns {Calculator} this
   */
  rf (precision = 0) {
    if (this._p > precision) {
      let s = this._vi.toString()
      let p = s.length - this._p + precision // 需要移动的位数
      if (p < 0) {
        this._vi = 0
        this._p = 0
      } else {
        this._vi = Number(s.substr(0, p))
        this._p = precision
      }
      this._v = null
    }
    return this
  }

  /**
   * 向上舍入
   * @param {Number} precision 精度
   * @returns {Number} 结果
   */
  ceil (precision = 0) {
    if (this._p > precision) {
      const m = _pow(10, this._p - precision)
      return _ceil(this._vi / m) / _pow(10, precision)
    } else if (this._p < 0) {
      return this._vi * _pow(10, -this._p)
    } else {
      return this._vi / _pow(10, this._p)
    }
  }

  /**
   * 向上舍入
   * @param {Number} precision 精度
   * @returns {Number} 结果
   */
  cv (precision = 0) {
    return this.ceil(precision)
  }

  /**
   * 向下舍入
   * @param {Number} precision 精度
   * @returns {Number} 结果
   */
  floor (precision = 0) {
    if (this._p > precision) {
      const m = _pow(10, this._p - precision)
      return _floor(this._vi / m) / _pow(10, precision)
    } else {
      return this._vi / _pow(10, this._p)
    }
  }

  /**
   * 向下舍入
   * @param {Number} precision 精度
   * @returns {Number} 结果
   */
  fv (precision = 0) {
    return this.floor(precision)
  }

  fmt (fmt = '#,##0.00', prefix = '', suffix = '') {
    return this.format(fmt, prefix, suffix)
  }

  format (fmt = '#,##0.00', prefix = '', suffix = '') {
    return format(this.v(), fmt, prefix, suffix)
  }

  thousands (precision = 2) {
    return format(this.rv(precision), '#,##0.', '', '', ',', precision);
  }

  /**
   * 按照货币格式化
   * @param {*} currency 货币，可以为空
   * @param {*} positiveSign 
   */
  currency (currency = '', positiveSign = false) {
    currency = currency || '';
    if (positiveSign && this._vi >= 0) {
      currency = currency + '+';
    }
    return format(this.rv(2), '#,##0.00', currency, '');
  }

  /**
   * 格式化成有符号
   * @param {*} prefix 前缀
   * @param {*} [precision=2] 精度(默认2)
   * @returns {String} 格式化结果
   */
  signed (prefix = '', precision = 2) {
    prefix = prefix || '';
    if (this._vi >= 0) {
      prefix = prefix + '+';
    }
    return format(this.rv(precision), '0.00', prefix, '', '', precision);
  }

  /**
   * 格式化成无符号
   * @param {*} prefix 前缀
   * @param {*} [precision=2] 精度(默认2)
   * @returns {String} 格式化结果
   */
  unsigned (prefix = '', precision = 2) {
    prefix = prefix || '';
    let v = this.rv(precision);
    if (this._vi < 0) {
      v = v.toString().slice(1);
    }
    return format(v, '0.', prefix, '', '', precision);
  }

  debug () {
    this._print(this._vi, this._p)
    return this
  }

  /**
   * 重载直接用于运算符
   */
  valueOf () {
    return this.v()
  }

  /**
   * 重载返回值
   */
  toString () {
    return this.vs()
  }

  /**
   * 重载用于JSON.stringify
   */
  toJSON () {
    return this.v()
  }

  /**
   * 重载用于inspect以及console`console.log($C(1))`
   */
  [inspect.custom] () {
    return this.v()
  }

  /**
   * 是否为0
   */
  isZero () {
    return this._vi === 0
  }

  /**
   * 正数
   */
  positive () {
    return this._vi > 0
  }

  /**
   * 负数
   */
  negative () {
    return this._vi < 0
  }

  /**
   * 取绝对值
   */
  abs () {
    this._vi = _abs(this._vi)
    this._v = null
    return this;
  }

}

class StrictCalculator extends Calculator {
  constructor(v) {
    super(v)
    if (!(v && v._vi)) {
      this.check(v)
    }
  }

  check (v) {
    if (isNaN(v)) throw new Error(`Invalid number[${v}]`)
  }

  $check (v) {
    if (typeof v._vi === 'undefined') throw new Error(`Invalid calculator[${v}]`)
  }

  add (v) {
    this.check(v)
    return super.add(v)
  }

  $add (v) {
    this.$check(v)
    return super.$add(v)
  }

  sub (v) {
    this.check(v)
    return super.sub(v)
  }

  $sub (v) {
    this.$check(v)
    return super.$sub(v)
  }

  mul (v) {
    this.check(v)
    return super.mul(v)
  }

  $mul (v) {
    this.$check(v)
    return super.$mul(v)
  }

  div (v) {
    this.check(v)
    return super.div(v)
  }

  $div (v) {
    this.$check(v)
    return super.$div(v)
  }
}

function calculator (v) {
  return new calculator.Calculator(v)
}

function strict (v) {
  return new StrictCalculator(v)
}

function withStrict () {
  calculator.Calculator = StrictCalculator;
  return this;
}

function withoutStrict () {
  calculator.Calculator = Calculator;
  return this;
}

Calculator.prototype._print = console.error.bind(console, '[debug]')

calculator.setDebug = function (print) {
  Calculator.prototype._print = print
}

calculator.resetDebug = function () {
  Calculator.prototype._print = console.error.bind(console, '[debug]')
}

calculator.Calculator = Calculator
calculator.StrictCalculator = StrictCalculator;
/**
 * 初始化一个计算器
 */
calculator.$ = calculator
calculator.strict = strict;
calculator.withStrict = withStrict;
calculator.withoutStrict = withoutStrict;
module.exports = calculator