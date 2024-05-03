import { defaults } from "../utils.js";
/**
 * number
 * minNumber
 * maxNumber
 */

/** @typedef {import('../index.js').Predicate} Predicate */

const KEY = defaults.KEY;

/** @type {Predicate} */
let number = (value, key = KEY) => {
  let expected = "number";
  if (typeof value === "number") return value;
  throw TypeError(
    `Expected {${key}} to be ${expected}. Given {${key}: ${value}}`,
  );
};

/** @type {(expected: number) => Predicate} */
let minNumber =
  (expected) =>
  (value, key = KEY) => {
    number(expected, "minNumber");
    number(value, key);
    if (value >= expected) return value;
    throw TypeError(
      `Expected {${key}} to be greater than or equal to ${expected}. Given {${key}: ${value}}`,
    );
  };

/** @type {(expected: number) => Predicate} */
let maxNumber =
  (expected) =>
  (value, key = KEY) => {
    number(expected, "maxNumber");
    number(value, key);
    if (value <= expected) return value;
    throw TypeError(
      `Expected {${key}} to be less than or equal to ${expected}. Given {${key}: ${value}}`,
    );
  };

export { number, minNumber, maxNumber };
