/**
 * number 
 * minNumber
 * maxNumber 
 */
let number = (pair) => {
  let {key, value} = pair;
  let expected = "number"
  if(typeof value === "number") return pair;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
}

let minNumber = (expected) => (pair) => {
  let {key, value} = number(pair);
  if(value >= expected) return pair;
  throw TypeError(`Expected {${key}} to be greater than or equal to ${expected}. Given {${key}: ${value}}`);
};

let maxNumber = (expected) => (pair) => {
  let {key, value} = number(pair);
  if(value <= expected) return pair;
  throw TypeError(`Expected {${key}} to be less than or equal to ${expected}. Given {${key}: ${value}}`);
};

module.exports = {
  number,
  minNumber,
  maxNumber
}
