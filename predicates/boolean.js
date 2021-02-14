/**
 * truthy
 * falsy
 */

// truthy
let truthy = function truthy(pair) {
  let { key, value } = pair;
  if(value) return pair;
  throw TypeError(`Expected {${key}} to be truthy. Given {${key}: ${value}}`);
}

// falsy
let falsy = function falsy(pair) {
  let { key, value } = pair;
  if(!value) return pair;
  throw TypeError(`Expected {${key}} to be falsy. Given {${key}: ${value}}`);
}


module.exports = {
  truthy,
  falsy
}
