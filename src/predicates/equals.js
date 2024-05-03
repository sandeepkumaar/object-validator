/**
 * equals
 */

import { defaults } from "../utils.js";
const KEY = defaults.KEY;

/** @typedef {import('../index.js').Predicate} Predicate */

/** @type {(expected: any) => Predicate} */
let equals =
  (expected) =>
  (value, key = KEY) => {
    if (expected === value) return value;
    throw TypeError(
      `Expected {${key}} to be equal to ${expected}. Given {${key}: ${value}}`,
    );
  };

export { equals };
