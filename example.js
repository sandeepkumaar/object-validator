//import validator, {pipe, is, setDefault, date } from '@sknk/object-validator'
import validator, {
  pipe,
  pipeArgs,
  is,
  setDefault,
  date,
} from "./src/index.js";

/* import predicates separately as well. */
//import { is, setDefault, date }  from '@sknk/object-validator/predicates'

let obj = validator(
  {
    name: "name",
    age: 24,
    dob: "09-14-1992",
  },
  {
    name: "string",
    age: [is("number"), "18-24"],
    city: [setDefault("cbe"), "string", "/^.{3}$/"],
    dob: [date],
  },
  {
    aggregateError: false,
    strict: true,
    pipeline: [
      function addFields(o) {
        return { ...o, x: "addfield" };
      },
    ],
    handleError: (i) => i,
  },
);

console.log(obj);
/*
 {
   name: 'name',
   age: 24,
   city: 'cbe',
   dob: '09-14-1992',
   x: 'addfield'
 }
*/

/**
 * Function argument validation
 */

function add(a, b) {
  return a + b;
}

function checkArgs(...args) {
  let obj = Object.fromEntries(args.entries());
  let schema = {
    0: ["+integer", "0-100"],
    1: ["+integer", "0-100"],
    2: [
      "object",
      {
        errCb: (e) => {
          return new TypeError("Invalid Optional argument");
        },
      },
    ],
  };
  obj = validator(obj, schema);
  return Object.values(obj);
}

let strictAdd = pipeArgs(checkArgs, add);

let ans = strictAdd(10, -2, { opts: false });

console.log(ans);
