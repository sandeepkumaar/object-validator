/**
 * String predicates
 */
let string = (pair) => {
  let {key, value} = pair;
  let expected = "string"
  if(typeof value === expected) return pair;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
}

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


module.exports = {
  string, 
  minString, 
  maxString
}
