import { defaults } from '../utils.js'

/**
 * @param {string} value - could be any value
 * @param {string} [key] - Optional key - coming from object key
 * @returns {string} 
 * @throws {TypeError} 
*/

let key = defaults.KEY;
const string = function(value) {
  let expected = 'string';
  if(typeof value === expected) return value;
  throw TypeError(`Expected {${key}} to be ${expected}. Given {${key}: ${value}}`);
};

const defined = function(value) {
  if(typeof value !== undefined) return value;
  throw TypeError(`Expected {${key}} to be defined. Given {${key}: ${value}}`);
};


const number = function(value) {
  if(typeof value === 'number') return value;
  throw TypeError(`Expected {${key}} to be number. Given {${key}: ${value}}`);
};


export {
  string,
  defined,
  number
}
