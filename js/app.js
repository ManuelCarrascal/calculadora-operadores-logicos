import { evalExpr, truthCombinations, parse, tokenize } from './logic.js';
import { clearOutput } from './ui.js';
import { setupButtons } from './logicButtons.js';
import { handleInput } from './handleInput.js';

const objApp = {};

function insertSymbol(symbol) {
  const exprInput = document.querySelector('#expr');
  const currentValue = exprInput.value;
  const selectionStart = exprInput.selectionStart;
  const newValue =
    currentValue.slice(0, selectionStart) +
    symbol +
    currentValue.slice(selectionStart);
  exprInput.value = newValue;
  exprInput.selectionStart = selectionStart + symbol.length;
  exprInput.selectionEnd = selectionStart + symbol.length;
  exprInput.focus();
  handleInput(newValue);
}

function main() {
  const exprInput = document.querySelector('#expr');
  exprInput.addEventListener('input', function () {
    const val = exprInput.value;
    if (this.lastInputValue !== val) {
      this.lastInputValue = val;
      handleInput(val);
    }
  });
  exprInput.dispatchEvent(new Event('input'));
}

objApp.truthCombinations = truthCombinations;
objApp.handleInput = handleInput;
objApp.evalExpr = evalExpr;
objApp.parse = parse;
objApp.tokenize = tokenize;
objApp.clearOutput = clearOutput;
objApp.main = main;

window.truth = objApp;
window.insertSymbol = insertSymbol;
window.onload = function () {
  main();
  setupButtons();
};
