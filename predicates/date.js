/**
 * date
 * minDate
 * maxDate
 * dateEquals
 */
let date = (pair) => {
  let {key, value} = pair;
  let expected = "Date";
  if(new Date(value).toString() !== "Invalid Date") return pair;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
}

let minDate = (expected) => (pair) => {
  let {key, value} = date(pair);
  if(new Date(value) >= new Date(expected)) return pair;
  throw TypeError(`Expected {${key}} to be after ${expected}. Given {${key}: ${value}}`);
};

let maxDate = (expected) => (pair) => {
  let {key, value} = date(pair);
  if(new Date(value) <= new Date(expected)) return pair;
  throw TypeError(`Expected {${key}} to be before ${expected}. Given {${key}: ${value}}`);
};

let dateEquals = (expected) => (pair) => {
  let {key, value} = date(pair);
  if(new Date(value).getTime() <= new Date(expected).getTime()) return pair;
  throw TypeError(`Expected {${key}} to be equal ${expected}. Given {${key}: ${value}}`);
};

module.exports = {
  date,
  minDate,
  maxDate,
  dateEquals
};
