import add from './large-number.js';
import getStrNumber from './getStrNumber.js';

const s1 = getStrNumber();
const s2 = getStrNumber();

document.write(`${s1} + ${s2} = `, add(s1, s2));