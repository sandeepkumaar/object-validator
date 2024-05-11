import validator, { pipe, pipeArgs } from "@sknk/object-validator";

/* import predicates separately as well. */
import { is, setDefault, date } from "@sknk/object-validator/predicates";
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

console.log("object-validator", obj);
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
  //let obj = Object.fromEntries(args.entries());
  let [a, b, opts] = args;
  let obj = { a, b, opts };

  let schema = {
    a: ["+integer", "0-100"],
    b: ["+integer", "0-100"],
    opts: [
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

let res = strictAdd(10, 2, { opts: false });

console.log("argument-validator", res);
