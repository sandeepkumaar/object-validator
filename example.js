//import validator, {pipe, is, setDefault, date } from '@sknk/object-validator'
import validator, { pipe, is, setDefault, date } from "./src/index.js";

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
