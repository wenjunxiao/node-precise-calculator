const _pow = Math.pow
const _floor = Math.floor
const _round = Math.round

/**
 * 银行家舍入
 * @param {*} v 
 * @param {*} p
 * @param {*} precision 
 */
function evenRound (v, p, precision) {
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
function upRound (v, p, precision) {
  if (precision) {
    return _round(v * _pow(10, precision - p)) / _pow(10, precision)
  } else {
    return _round(v / _pow(10, p))
  }
}

function format (v, fmt = '##0.00', prefix = '', suffix = '', join = ',') {
  v = v.toString()
  let pv = v.indexOf('.')
  let step = fmt.indexOf('.')
  let l = fmt.length - step - 1
  if (step < 0) { // 没有小数
    step = fmt.length
    if (pv < 0) {
      pv = v.length
    } else {
      v = v.substr(0, pv)
    }
  } else if (l === 0) { // 保留所有小数位数
    if (pv < 0) {
      pv = v.length
    }
  } else { // 固定小数位数
    if (pv < 0) { // 没有小数点
      pv = v.length
      v = v + '.'
      while ((l--) > 0) {
        v = v + '0'
      }
    } else {
      l -= v.length - pv - 1
      if (l < 0) {
        v = v.slice(0, l)
      } else {
        while ((l--) > 0) {
          v = v + '0'
        }
      }
    }
  }
  if (step > 0) {
    step = step - fmt.indexOf(join) - 1
    if (isNaN(v[0])) {// +/-正负数
      let p = (pv - 1) % step
      if (p > 0) {
        let r = v.substr(0, ++p)
        for (; p < pv; p += step) {
          r = r + join + v.substr(p, step)
        }
        return prefix + r + v.substr(pv) + suffix
      } else {
        p = step + 1
        let r = v.substr(0, p)
        for (; p < pv; p += step) {
          r = r + join + v.substr(p, step)
        }
        return prefix + r + v.substr(pv) + suffix
      }
    } else {
      let p = pv % step
      if (p > 0) {
        let r = v.substr(0, p)
        for (; p < pv; p += step) {
          r = r + join + v.substr(p, step)
        }
        return prefix + r + v.substr(pv) + suffix
      } else {
        let r = v.substr(0, p += step)
        for (; p < pv; p += step) {
          r = r + join + v.substr(p, step)
        }
        return prefix + r + v.substr(pv) + suffix
      }
    }
  }
  return v
}

module.exports = {
  upRound,
  format,
  evenRound
}