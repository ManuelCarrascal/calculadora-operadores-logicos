import { SYMBOL, WHITESPACE } from './regex.js';

export function evalExpr(t, b) {
  function e(e) {
    const r = t[e];
    if (Array.isArray(r)) return evalExpr(r, b);
    assertBoolean(b[r]);
    return b[r];
  }
  if (!t) throw new SyntaxError('Expresión inválida: ' + t);
  if (!Array.isArray(t)) return b[t];
  switch (t[0]) {
    case '^':
      return e(1) && e(2);
    case '∨':
      return e(1) || e(2);
    case '→':
      return !e(1) || e(2);
    case '↔':
      return e(1) === e(2);
    case '¬':
      return !e(1);
    default:
      throw new SyntaxError('Operador no reconocido: ' + t[0]);
  }
}

export function isBoolean(val) {
  return typeof val === 'boolean';
}

export function assertBoolean(val) {
  if (!isBoolean(val)) {
    throw new SyntaxError('Símbolo no asignado: ' + val);
  }
}

export function truthCombinations(symbols) {
  if (!symbols) {
    return [{}];
  }
  const key = Object.keys(symbols)[0];
  if (!key) {
    return [{}];
  }
  const tmp = { ...symbols };
  delete tmp[key];
  const prev = truthCombinations(tmp);
  const ret = [];
  for (const prevComb of prev) {
    ret.push({ ...prevComb, [key]: true });
    ret.push({ ...prevComb, [key]: false });
  }
  return ret;
}

let pos;
let symbols;
let tokens;

function getCurToken() {
  return tokens[pos];
}
function consumeToken(expected) {
  const curTok = getCurToken();
  if (expected && curTok !== expected) {
    console.log(
      `No se encontró el token esperado. Esperado: "${expected}" Actual: "${curTok}".`
    );
  }
  pos++;
  return curTok;
}

function consumeSymbol() {
  const symbol = consumeToken();
  symbols[symbol] = true;
  return symbol;
}

export function expr() {
  if (getCurToken() === '¬') {
    return [consumeToken(), binaryExpr()];
  }
  return binaryExpr();
}

export function binaryExpr() {
  return implicationExpr();
}

function implicationExpr() {
  const a1 = equivalenceExpr();
  if (getCurToken() === '→') {
    return [consumeToken(), a1, implicationExpr()];
  }
  return a1;
}

function equivalenceExpr() {
  const a1 = orExpr();
  if (getCurToken() === '↔') {
    return [consumeToken(), a1, equivalenceExpr()];
  }
  return a1;
}

function orExpr() {
  const a1 = andExpr();
  if (getCurToken() === '∨') {
    return [consumeToken(), a1, orExpr()];
  }
  return a1;
}

function andExpr() {
  const a1 = subExpr();
  if (getCurToken() === '^') {
    return [consumeToken(), a1, andExpr()];
  }
  return a1;
}

function subExpr() {
  if (getCurToken() === '(') {
    consumeToken('(');
    const ret = expr();
    consumeToken(')');
    return ret;
  }
  if (SYMBOL.test(getCurToken())) {
    return consumeSymbol();
  }
  return expr();
}

export function parse(tok) {
  if (!tok || !tok.length) {
    return [];
  }
  tokens = tok;
  pos = 0;
  symbols = {};
  const ret = expr();

  return [ret, symbols];
}

export function tokenize(str) {
  if (!str || WHITESPACE.test(str)) {
    return [];
  }
  const ret = str.split(/\b/);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = ret[i].replace(/\s/g, '');

    if (!ret[i].length) {
      ret.splice(i, 1);
    } else if (!SYMBOL.test(ret[i])) {
      const arr = [];
      for (let j = 0; j < ret[i].length; j++) {
        arr.push(ret[i][j]);
      }

      ret.splice.apply(ret, [i, 1].concat(arr));
    }
  }
  return ret;
}
