import { defaults } from "../utils.js";

/**
 * @typedef {<T>(value: T, key?: string) => T | never} Predicate
 */

const KEY = defaults.KEY;

/** @type {Predicate} */
const string = function (value, key = KEY) {
  let expected = "string";
  if (typeof value === expected) return value;
  throw TypeError(
    `Expected {${key}} to be ${expected}. Given {${key}: ${value}}`,
  );
};

/** @type {Predicate} */
const defined = function (value, key = KEY) {
  if (typeof value !== "undefined") return value;
  throw TypeError(`Expected {${key}} to be defined. Given {${key}: ${value}}`);
};

/** @type {Predicate} */
const number = function (value, key = KEY) {
  if (typeof value === "number") return value;
  throw TypeError(`Expected {${key}} to be number. Given {${key}: ${value}}`);
};

/** @type {(def: any) => (value: any) => def | value} */
const setDefault = (def) => (value) => {
  return value === undefined ? def : value;
};

export { string, defined, number, setDefault };
