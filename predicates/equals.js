/**
 * equals
 */

let equals = (expected) => (pair) => {
  let { key, value } = pair;
  if(expected === value) return pair;
  throw TypeError(`Expected {${key}} to be equal to ${expected}. Given {${key}: ${value}}`);
};


module.exports = {
  equals
};
