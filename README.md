# precise-calculator

Precise Calculator

## Usage

  Install globally to use repl

```bash
npm install -g precise-calculator
```

```bash
$ pcalc
$C> 1 + 1
2
```

  Or install in project to use api

```js
const $C = require('precise-calculator')
// (1 + 1) * 1 / 1 - 1
$C(1).add(1).mul(1).div(1).sub(1).v()
```

## API

### Calculator

```js
const $C = require('precise-calculator')
$C(1)
$C('1')
new $C.Calculator(1)
new $C.Calculator('1')
```

#### `add(n)`/`$add(c)`
  Arithmetic operator `+`.
```js
$C(1).add(1)
$C(1).add('1')
$C('1').$add($C(1))
```

#### `sub(n)`/`$sub(c)`
  Arithmetic operator `-`.
```js
$C(1).sub(1)
$C(1).sub('1')
$C('1').$sub($C(1))
```

#### `mul(n)`/`$mul(c)`
  Arithmetic operator `*`.
```js
$C(1).mul(1)
$C(1).mul('1')
$C('1').$mul($C(1))
```

#### `div(n)`/`$div(c)`
  Arithmetic operator `/`.
```js
$C(1).div(1)
$C(1).div('1')
$C('1').$div($C(1))
```

#### `round(precision)`/`rv(precision)`
  Use default rounding method to round and return the value with special precision.
  Default rounding method is round-half-up, which can be changed by `setup()`
```js
$C(3.141).round(2) // 3.14
$C(3.145).rv(2) // 3.15
```

#### `upRound(precision)`/`uv(precision)`
  Use round-half-up to round and return the value with special precision.
```js
$C(3.141).upRound(2) // 3.14
$C(3.145).uv(2) // 3.15
```

#### `evenRound(precision)`/`ev(precision)`
  Use round-half-even to round and return the value with special precision.
```js
$C(3.145).evenRound(2) // 3.14
$C(3.155).ev(2) // 3.16
```

#### `ceil(precision)`/`cv(precision)`
  Ceil and return the value with special precision.
```js
$C(3.141).ceil(2) // 3.15
$C(3.155).cv(2) // 3.16
```

#### `floor(precision)`/`fv(precision)`
  Floor and return the value with special precision.
```js
$C(3.146).floor(2) // 3.14
$C(3.151).fv(2) // 3.15
```

### `format(fmt='##0.00', prefix='', suffix='')`
  Format the value with special formatter
```js
$C(1234.1).format('##0.00') // 1,234.10
$C(1234.1).format('##0.00', '$') // $1,234.10
$C(12.3).format('##0.00', '', '%') // 12.30%
```

### `v()`
  Return the number value of current result.
```js
$C(1).add(2).v() // number value `3`
```

### `vs()`
  Return the string value of current result.
```js
$C(1).add(2).vs() // string value `3`
```

### `ve()`
  Return the scientific notation value of current result.
```js
$C(10).mul(100).ve() // string value `1e+3`
```

### `compile(expr, ...args)`/`ccompile(expr, ...args)`

  Compile the arithmetic expression to corresponding function. There must be spaces before and after the operator in the expression. `ccompile` cached the compilation result for reuse.

```js
$C.compile('1 +1') // invalid expression
$C.compile('1+1') // invalid expression

const formula1 = $C.compile('1 + 1') // valid expression
const formula2 = $C.compile('(x + y) * z', 'x', 'y', 'z') // valid expression

// Execute formula
console.log(formula1()) // 2
console.log(formula2(1, 2, 3)) // 9
```

  More settings can be set in curly braces after all parentheses. Such as, rounding, formatting, etc.
```js
const d = {x:1.23, y:1.224, z:3}
$C.compile('((d.x + d.y) * d.z)', 'd')(d) // 7.362
$C.compile('((d.x + d.y) * d.z){.2R}', 'd')(d) // 7.36
$C.compile('((d.x + d.y){.2R} * d.z)', 'd')(d) // 7.35
$C.compile('((d.x + d.y){.2R} * d.z){.1R}', 'd')(d) // 7.4
```

### Expression settings

  Settings arguments`{[prefix][format][mode][suffix]}`

* `prefix` used in `format()` as `prefix` argument, supports `$¥`
* `format` used in `format()`, and rouding methods if there is any rounding `mode`. 
  Supports two formats, standard format(`##0`,`##0.00`,`.00`) and digital mode(`3`, `3.2`, `.2`)
* `mode` rounding mode:
  - `R` use default rounding method, `(1.123){.2R}` means `$C(1.123).r(2).v()`
  - `U` use round-half-up method, `(1.123){.2U}` means `$C(1.123).ru(2).v()`
  - `E` use round-half-even method, `(1.123){.2E}` means `$C(1.123).re(2).v()`
  - `C` use round-ceil method, `(1.123){.2C}` means `$C(1.123).rc(2).v()`
  - `F` use round-floor method, `(1.123){.2F}` means `$C(1.123).rf(2).v()`
  - `S`/`s` specify the result to return a string, and can be used with rounding mode, 
    `(1.123){S}` means `$C(1.123).vs()`, `(1.123){.2Rs}` means `$C(1.123).r(2).vs()`
  - `e` specify the result to return a scientific, `(1.123){e}` means `$C(1.123).ve()`
  - `P` specify the result as a percentage with the suffix `%`, `(1.123){P}` means `$C(1.123).mul(100).format('.','','%')`
* `suffix` used in `format()` as `suffix` argument, supports `%`
