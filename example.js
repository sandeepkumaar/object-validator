import {v, vSchema, composeValidators} from './src/index.js';
import {string, setDefault, number} from './src/predicates/string.js';


let x = v([setDefault(24), number])();
console.log(x);
/*
let obj = { name: 'sandeep' }
let schema = vSchema({
  name: string,
  age: v([setDefault(24), number]),
});

console.log(schema(obj));
*/
