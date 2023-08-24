const tabla = document.querySelector('#tabla');
const expresionInput = document.querySelector('#expresion');
const form = document.querySelector('#form');

function agregarOperador(operador) {
  const posicion = expresionInput.selectionStart;
  const texto = expresionInput.value;
  const nuevoTexto =
    texto.slice(0, posicion) + operador + texto.slice(posicion);
  expresionInput.value = nuevoTexto;
  expresionInput.selectionStart = posicion + 1;
  expresionInput.selectionEnd = posicion + 1;
}

const botonAnd = document.querySelector('#button__and');
botonAnd.addEventListener('click', () => agregarOperador('^'));

const botonOr = document.querySelector('#button__or');
botonOr.addEventListener('click', () => agregarOperador('v'));

const botonNot = document.querySelector('#button__negacion');
botonNot.addEventListener('click', () => agregarOperador('¬'));

const botonImplica = document.querySelector('#button__entonces');
botonImplica.addEventListener('click', () => agregarOperador('→'));

const botonDobleImplica = document.querySelector('#button__doble');
botonDobleImplica.addEventListener('click', () => agregarOperador('↔'));

function evaluarExpresion(expresion, valores) {
  const operadores = {
    '^': {
      precedencia: 3,
      asociatividad: 'izquierda',
      funcion: (a, b) => a && b,
    },
    v: {
      precedencia: 2,
      asociatividad: 'izquierda',
      funcion: (a, b) => a || b,
    },
    '¬': { precedencia: 4, asociatividad: 'derecha', funcion: (a) => !a },
    '→': {
      precedencia: 1,
      asociatividad: 'derecha',
      funcion: (a, b) => !a || b,
    },
    '↔': {
      precedencia: 0,
      asociatividad: 'izquierda',
      funcion: (a, b) => a === b,
    },
  };

  const cola = [];
  const pila = [];

  const tokens = expresion
    .split(/([\^v¬→↔()])/)
    .filter((token) => token.trim() !== '');

  for (const token of tokens) {
    if (token in operadores) {
      while (
        pila.length > 0 &&
        pila[pila.length - 1] !== '(' &&
        ((operadores[token].asociatividad === 'izquierda' &&
          operadores[token].precedencia <=
            operadores[pila[pila.length - 1]].precedencia) ||
          (operadores[token].asociatividad === 'derecha' &&
            operadores[token].precedencia <
              operadores[pila[pila.length - 1]].precedencia))
      ) {
        cola.push(pila.pop());
      }
      pila.push(token);
    } else if (token === '(') {
      pila.push(token);
    } else if (token === ')') {
      while (pila.length > 0 && pila[pila.length - 1] !== '(') {
        cola.push(pila.pop());
      }
      if (pila.length === 0) {
        throw new Error('Expresión mal formada: paréntesis sin cerrar');
      }
      pila.pop();
    } else {
      if (!(token in valores)) {
        throw new Error(`Expresión mal formada: variable ${token} no definida`);
      }
      cola.push(valores[token]);
    }
  }

  while (pila.length > 0) {
    if (pila[pila.length - 1] === '(') {
      throw new Error('Expresión mal formada: paréntesis sin cerrar');
    }
    cola.push(pila.pop());
  }

  const pilaEval = [];

  for (const token of cola) {
    if (token in operadores) {
      if (pilaEval.length < 2) {
        throw new Error('Expresión mal formada: operador sin operandos');
      }
      const b = pilaEval.pop();
      const a = pilaEval.pop();
      pilaEval.push(operadores[token].funcion(a, b));
    } else {
      pilaEval.push(token);
    }
  }

  if (pilaEval.length !== 1) {
    throw new Error('Expresión mal formada: sobran operandos');
  }

  return pilaEval[0];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const expresion = expresionInput.value;
  const valores = expresion.split(/[\^v→↔]/);
  const n = valores.length;
  const filas = Math.pow(2, n);

  // Generar la tabla
  tabla.innerHTML = ''; // Limpiar la tabla
  const encabezado = document.createElement('tr');
  for (let i = 0; i < n + 1; i++) {
    const th = document.createElement('th');
    if (i == n) {
      th.textContent = expresion;
    } else {
      th.textContent = valores[i];
    }
    encabezado.appendChild(th);
  }
  tabla.appendChild(encabezado);

  for (let i = 0; i < filas; i++) {
    const fila = document.createElement('tr');
    const valoresFila = {};
    for (let j = 0; j < n; j++) {
      const td = document.createElement('td');
      const valor = (i >> (n - j - 1)) & 1;
      valoresFila[valores[j]] = valor;
      td.textContent = valor;
      fila.appendChild(td);
    }
    const resultado = evaluarExpresion(expresion, valoresFila);
    const tdResultado = document.createElement('td');
    tdResultado.textContent = resultado ? 'V' : 'F';
    fila.appendChild(tdResultado);
    tabla.appendChild(fila);
  }
});
