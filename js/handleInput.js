import { clearOutput, displayCombinations } from './ui.js';
import { tokenize, parse, truthCombinations } from './logic.js';

export function handleInput(val) {
  try {
    clearOutput();
    if (val.trim() === '') {
      return;
    }
    const tok = tokenize(val);
    const [treeAbstractSintaxis, sym] = parse(tok);
    displayCombinations(val, sym, treeAbstractSintaxis, truthCombinations(sym));
  } catch (e) {
    throw e;
  }
}
