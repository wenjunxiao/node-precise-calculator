#!/usr/bin/env node
const C = require('../index')

const pos = process.argv.indexOf('--listen')
if (pos > 0) {
  const http = require('http')
  const qs = require('querystring')
  const [port, host] = process.argv[pos + 1].split(':').reverse()
  return http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Powered-By', 'Precise Calculator Server');
    const pos = req.url.indexOf('?');
    if (pos > 0) {
      const query = decodeURIComponent(req.url.substr(pos + 1));
      if (/(?:^|\W)e=\s*([^&]+)\s*/.test(query)) {
        return res.end(C.eval(RegExp.$1).toString())
      }
    }
    if (req.method === 'POST') {
      const chunks = [];
      req.on('readable', () => {
        let chunk;
        while (null !== (chunk = req.read())) {
          chunks.push(chunk);
        }
      });
      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (/application\/x-www-form-urlencoded/i.test(contentType)) {
          req.body = qs.parse(buffer.toString());
        } else if (/application\/json/i.test(contentType)) {
          req.body = JSON.parse(buffer.toString());
        }
        if (req.body.e) {
          let d = req.body.d
          try {
            d = JSON.parse(d)
          } catch (_) { }
          const ns = Object.keys(d)
          return res.end(C.eval(req.body.e, ns, ns.map(n => d[n])).toString())
        }
      })
    }
    return res.end('')
  }).listen(parseInt(port, 10), host || '0.0.0.0', function () {
    const addr = this.address()
    console.error('calculator listen => %s:%s', addr.address, addr.port)
  })
}

if (process.argv.length > 2) {
  return console.log(C.eval(process.argv.slice(2).join(' ')))
}

const vm = require('vm')
const readline = require('readline')
const inspect = require('util').inspect
const rl = readline.createInterface(process.stdin, process.stdout)

const ctx = vm.createContext({ $: C, $C: C, require, console })
const ignores = Object.keys(ctx)
rl.setPrompt('$C> ')
rl.on('line', line => {
  line = line.trim()
  if (line.length > 0) {
    if (/(^.*?)\s*\/\//.test(line)) {
      line = RegExp.$1
    }
    if (/^console\.\w+\((.*)\);?$/i.test(line)) {
      line = RegExp.$1
    }
    try {
      if (/^\$C?(\W|$)/.test(line)) {
        console.log(vm.runInContext(`require('util').inspect(${line})`, ctx))
      } else if (/^%c(?:ompile)?\s*(.*)$/.test(line)) {
        console.log(C.compile(RegExp.$1))
      } else if (/^(?:(?:let|const|var)\s+)?([\w.]+\s*=\s*.*)$/.test(line)) {
        vm.runInContext(RegExp.$1, ctx)
      } else if (/^\w+$/.test(line) || /^(\w+)\(/.test(line) && ctx[RegExp.$1]) {
        console.log(vm.runInContext(line, ctx))
      } else {
        const args = Object.keys(ctx).filter(s => ignores.indexOf(s) < 0)
        const names = args.length > 0 ? ',' + args.map(s => `'${s}'`) : ''
        const vals = args.length > 0 ? ',' + args.join(',') : ''
        console.log(inspect(vm.runInContext(`$C.eval(${JSON.stringify(line)}${names}${vals})`, ctx)))
      }
    } catch (err) {
      console.error(err)
    }
  }
  rl.prompt()
}).prompt()