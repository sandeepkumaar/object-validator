import { validator } from "./src/index.js";
import {
  string,
  maxString,
  number,
  minNumber,
} from "./src/predicates/index.js";

let obj = {
  name: "sandeep",
  age: 24,
  abc: "a",
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
  age: [number, minNumber(18)],
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
