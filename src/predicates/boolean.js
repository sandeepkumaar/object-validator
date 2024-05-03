import { defaults } from "../utils.js";
/**
 * truthy
 * falsy
 */
/** @typedef {import('../index.js').Predicate} Predicate */
const KEY = defaults.KEY;

/** @type {Predicate} */
let truthy = function truthy(value, key = KEY) {
  if (value) return value;
  throw TypeError(`Expected {${key}} to be truthy. Given {${key}: ${value}}`);
};

/** @type {Predicate} */
let falsy = function falsy(value, key = KEY) {
  if (!value) return value;
  throw TypeError(`Expected {${key}} to be falsy. Given {${key}: ${value}}`);
};

/** @type {Predicate} */
let boolean = (value, key = KEY) => {
  if (value === true || value === false) return value;
  throw TypeError(
    `Expected {${key}} to be a boolean. Given {${key}: ${value}}`,
  );
};

export { truthy, falsy, boolean };
