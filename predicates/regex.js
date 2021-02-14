/**
 * Regex
 * regex(//); takes a regex literal
 */

let regex = (expected=new RegExp()) => (pair) => {
  let { key, value } = pair;
  let regex = new RegExp(expected);
  if(regex.test(value)) return pair;
  throw TypeError(`Expected {${key}} to be of pattern ${expected}. Given {${key}: ${value}}`);

};

module.exports = {
  regex
}
