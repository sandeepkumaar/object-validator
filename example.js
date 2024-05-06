import { validator } from "./src/index.js";
import { is } from "./src/predicates/index.js";
const string = is("string");
const number = is("number");

let obj = {
  name: "sandeep",
  age: "25",
  abc: "a",
};

let simpleSchema = {
  name: ["string", "/^.{3,8}$/"],
  age: ["number", "18-24"],
};

let x = validator(obj, simpleSchema, { aggregateError: true });
console.log("simple", x);

// complex

const maxString = (max) => (str, key) => {
  if (str.length > max) throw TypeError(`given string exceeds. ${key}`);
  return str;
};

let schema = {
  name: [
    string,
    maxString(5),
    {
      errCb: (e) => {
        e.message = "custom message";
        e.key = "customErrorKey";
        return e;
      },
    },
  ],
  age: [number, "18-24"],
  "city?": [string],
};

try {
  let value = validator(obj, schema, {
    aggregateError: true,
    strict: true,
    handleError: (e) => false,
    pipeline: [
      () => {
        throw Error("dummy");
      },
    ],
  });
  console.log(value);
} catch (e) {
  console.error(e);
}
