import { SYMBOL, WHITESPACE } from './regex.js';

export function evalExpr(tokens, BooleanValues) {
  function expression(tokensExpresion) {
    const resultValue = tokens[tokensExpresion];
    if (Array.isArray(resultValue)) return evalExpr(resultValue, BooleanValues);
    assertBoolean(BooleanValues[resultValue]);
    return BooleanValues[resultValue];
  }
  if (!tokens) throw new SyntaxError('Expresión inválida: ' + tokens);
  if (!Array.isArray(tokens)) return BooleanValues[tokens];
  switch (tokens[0]) {
    case '^':
      return expression(1) && expression(2);
    case '∨':
      return expression(1) || expression(2);
    case '→':
      return !expression(1) || expression(2);
    case '↔':
      return expression(1) === expression(2);
    case '¬':
      return !expression(1);
    default:
      throw new SyntaxError('Operador no reconocido: ' + tokens[0]);
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
  const temporal = { ...symbols };
  delete temporal[key];
  const prev = truthCombinations(temporal);
  const ret = [];
  for (const prevComb of prev) {
    ret.push({ ...prevComb, [key]: true });
    ret.push({ ...prevComb, [key]: false });
  }
  return ret;
}

let position;
let symbols;
let tokens;

function getCurToken() {
  return tokens[position];
}
function consumeToken(expected) {
  const curTok = getCurToken();
  if (expected && curTok !== expected) {
    throw new SyntaxError(
      `No se encontró el token esperado. Esperado: "${expected}" Actual: "${curTok}".`
    );
  }
  position++;
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
  const expressionConditional = equivalenceExpr();
  if (getCurToken() === '→') {
    return [consumeToken(), expressionConditional, implicationExpr()];
  }
  return expressionConditional;
}

function equivalenceExpr() {
  const expressionConditional = orExpr();
  if (getCurToken() === '↔') {
    return [consumeToken(), expressionConditional, equivalenceExpr()];
  }
  return expressionConditional;
}

function orExpr() {
  const expressionConditional = andExpr();
  if (getCurToken() === '∨') {
    return [consumeToken(), expressionConditional, orExpr()];
  }
  return expressionConditional;
}

function andExpr() {
  const expressionConditional = subExpr();
  if (getCurToken() === '^') {
    return [consumeToken(), expressionConditional, andExpr()];
  }
  return expressionConditional;
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
  position = 0;
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
