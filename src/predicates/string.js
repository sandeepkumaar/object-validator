import { defaults } from '../utils.js'

/**
 * @param {string} value - could be any value
 * @param {string} [key] - Optional key - coming from object key
 * @returns {string} 
 * @throws {TypeError} 
*/
const string = function(value, key=defaults.KEY) {
  let expected = 'string';
  if(typeof value === expected) return value;
  throw TypeError(`Expected {${key}} to be ${expected}. Given {${key}: ${value}}`);
};

const defined = function(value, key=defaults.KEY) {
  if(typeof value !== undefined) return value;
  throw TypeError(`Expected {${key}} to be defined. Given {${key}: ${value}}`);
};


const number = function(value, key=defaults.KEY) {
  if(typeof value === 'number') return value;
  throw TypeError(`Expected {${key}} to be number. Given {${key}: ${value}}`);
};


export {
  string,
  defined,
  number
}
