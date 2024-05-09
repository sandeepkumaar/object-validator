/**
 * date
 * minDate
 * maxDate
 * dateEquals
 */

import { defaults } from "../utils.js";
const KEY = defaults.KEY;

/** @typedef {import('../index.js').Predicate} Predicate */

/** @type {Predicate} */
let date = (value, key = KEY) => {
  let expected = "Date";
  if (new Date(value).toString() !== "Invalid Date") return value;
  throw TypeError(
    `Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`,
  );
};

/** @type {Predicate} */
let toDate = (value, key = KEY) => {
  let expected = "Date";
  if (new Date(value).toString() !== "Invalid Date") return new Date(value);
  throw TypeError(
    `Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`,
  );
};

/** @type {(expected: Date | string) => Predicate} */
let minDate =
  (expected) =>
  (value, key = KEY) => {
    date(expected, "minDate");
    date(value, key);
    if (new Date(value) >= new Date(expected)) return value;
    throw TypeError(
      `Expected {${key}} to be after ${expected}. Given {${key}: ${value}}`,
    );
  };

/** @type {(expected: Date | string) => Predicate} */
let maxDate =
  (expected) =>
  (value, key = KEY) => {
    date(expected, "maxDate");
    date(value, key);
    if (new Date(value) <= new Date(expected)) return value;
    throw TypeError(
      `Expected {${key}} to be before ${expected}. Given {${key}: ${value}}`,
    );
  };

/** @type {(expected: Date | string) => Predicate} */
let dateEquals =
  (expected) =>
  (value, key = KEY) => {
    date(expected, "dateEquals");
    date(value, key);
    if (new Date(value).getTime() <= new Date(expected).getTime()) return value;
    throw TypeError(
      `Expected {${key}} to be equal ${expected}. Given {${key}: ${value}}`,
    );
  };

export { date, toDate, minDate, maxDate, dateEquals };
