
/**
 * String predicates
 */
let string = (value) => {
  let key = this?.key || 'value';
  let expected = "string"
  if(typeof value === expected) return value;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
}

let number = (value) => {
  let {key='input'} = this;
  let expected = "number"
  if(typeof value === expected) return value;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
}
/*
let minString = (expected) => (pair) => {
  let {key, value} = string(pair);
  if(value.length >= expected) return pair;
  throw TypeError(`Expected {${key}} to be of minimum length ${expected}. Given {${key}: ${value}}`);
};

let maxString = (expected) => (pair) => {
  let {key, value} = string(pair);
  if(value.length <= expected) return pair;
  throw TypeError(`Expected {${key}} to be of maximum length ${expected}. Given {${key}: ${value}}`);
};
*/

export {
  string, 
  number,
}
