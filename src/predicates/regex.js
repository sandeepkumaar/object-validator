/**
 * Regex
 * regex(//); takes a regex literal
 */

import { defaults } from "../utils.js";
const KEY = defaults.KEY;

/** @typedef {import('../index.js').Predicate} Predicate */

/** @type {(expected: RegExp) => Predicate} */
let regex =
  (expected = new RegExp("")) =>
  (value, key = KEY) => {
    if (!(expected instanceof RegExp))
      throw TypeError(
        `Expected regex instance or literal. Given {${expected}}`,
      );
    let regex = new RegExp(expected);
    if (regex.test(value)) return value;
    throw TypeError(
      `Expected {${key}} to follow the pattern ${expected}. Given {${key}: ${value}}`,
    );
  };

export { regex };
