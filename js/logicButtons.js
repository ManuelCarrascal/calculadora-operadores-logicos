import { handleInput } from './handleInput.js';

export function setupButtons() {
  const exprInput = document.querySelector('#expr');
  const openingParenthesisButton = document.querySelector(
    '#button__openingParenthesis'
  );
  const closingParenthesisButton = document.querySelector(
    '#button__closingParenthesis'
  );
  openingParenthesisButton.addEventListener('click', function () {
    insertSymbol('(');
  });
  closingParenthesisButton.addEventListener('click', function () {
    insertSymbol(')');
  });
  const negationButton = document.querySelector('#button__negacion');
  negationButton.addEventListener('click', function () {
    insertSymbol('¬');
  });
  const andButton = document.querySelector('#button__and');
  const orButton = document.querySelector('#button__or');
  const thenButton = document.querySelector('#button__entonces');
  const doubleButton = document.querySelector('#button__doble');
  andButton.addEventListener('click', function () {
    insertSymbol('^');
  });
  orButton.addEventListener('click', function () {
    insertSymbol('∨');
  });
  thenButton.addEventListener('click', function () {
    insertSymbol('→');
  });
  doubleButton.addEventListener('click', function () {
    insertSymbol('↔');
  });
  exprInput.addEventListener('input', function () {
    const val = exprInput.value;
    handleInput(val);
  });
}

window.onload = function () {
  main();
  setupButtons();
};
