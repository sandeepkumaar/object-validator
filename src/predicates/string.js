/**
 * String predicates
 */

import { defaults } from "../utils.js";
import { number } from "./number.js";
const KEY = defaults.KEY;

/** @typedef {import('../index.js').Predicate} Predicate */

/** @type {Predicate} */
let string = (value, key = KEY) => {
  let expected = "string";
  if (typeof value === expected) return value;
  throw TypeError(
    `Expected {${key}} to be a ${expected}. Given {${key}: ${value}}`,
  );
};

/** @type {(expected: number) => Predicate} */
let minString =
  (expected) =>
  (value, key = KEY) => {
    number(expected, "minString");
    string(value, key);
    if (value.length >= expected) return value;
    throw TypeError(
      `Expected {${key}} to be of minimum length ${expected}. Given {${key}: ${value}}`,
    );
  };

/** @type {(expected: number) => Predicate} */
let maxString =
  (expected) =>
  (value, key = KEY) => {
    number(expected, "maxString");
    string(value, key);
    if (value.length <= expected) return value;
    throw TypeError(
      `Expected {${key}} to be of maximum length ${expected}. Given {${key}: ${value}}`,
    );
  };

export { string, minString, maxString };
