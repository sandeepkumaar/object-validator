import {validate} from './index2.js';
import {string, number} from './predicates2/string.js';

let obj = {
  name: 'sandeep',
  age: 24
};
/* check individual value */
//validate([string])(24);


/* decorateError */

validate([string], (e) => {
  e.message = 'should be a string'
  //return e;
})(24);

/*
let validator = schema({
  name: v([string], (e) => e),
  age: v([number, minNumber(18)]),
  city: v([string, stringLen(3)]),
});

let result = validator(obj, (e) => {
  return false
});

let validator = composeValidator([
  personSchemaValidator,
  compare
], {})
*/
