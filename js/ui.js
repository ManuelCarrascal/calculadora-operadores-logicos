import { evalExpr } from './logic.js';

export function displayCombinations(
  expression,
  symbols,
  treeAbstractSintaxis,
  combos
) {
  const comboContainer = document.querySelector('#container__table');
  comboContainer.classList.add(
    'my-5',
    'w-1/2',
    'flex',
    'flex-col',
    'items-center',
    'mx-auto'
  );
  const ret = document.createElement('table');
  ret.classList.add('border', 'border-collapse', 'w-full');
  const header = document.createElement('tr');
  header.classList.add('bg-gray-200');
  const symArr = Object.keys(symbols);
  for (const sym of symArr) {
    const th = document.createElement('th');
    th.classList.add(
      'border',
      'px-4',
      'py-2',
      'text-left',
      'font-semibold',
      'text-gray-700',
      'text-center'
    );
    th.textContent = sym;
    header.appendChild(th);
  }
  const exprTh = document.createElement('th');
  exprTh.classList.add(
    'border',
    'px-4',
    'py-2',
    'text-left',
    'font-semibold',
    'text-gray-700',
    'text-center'
  );
  exprTh.textContent = expression;
  header.appendChild(exprTh);
  ret.appendChild(header);
  comboContainer.appendChild(ret);
  for (const cur of combos) {
    const result = evalExpr(treeAbstractSintaxis, cur);
    const comboRow = document.createElement('tr');
    for (const sym of symArr) {
      const td = document.createElement('td');
      td.classList.add(
        'border',
        'px-4',
        'py-2',
        'text-gray-700',
        'text-center'
      );
      td.textContent = cur[sym] ? '1' : '0';
      comboRow.appendChild(td);
    }
    const resultTd = document.createElement('td');
    resultTd.classList.add(
      'border',
      'px-4',
      'py-2',
      'text-gray-700',
      'text-center'
    );
    resultTd.textContent = result ? '1' : '0';
    comboRow.appendChild(resultTd);
    ret.appendChild(comboRow);
  }
}

export function clearOutput() {
  const comboContainer = document.querySelector('#container__table');
  while (comboContainer.firstChild) {
    comboContainer.removeChild(comboContainer.firstChild);
  }
}
