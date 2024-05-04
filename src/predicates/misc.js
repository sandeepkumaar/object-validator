/** @typedef {import('./index.js').Predicate} Predicate **/

import { defaults } from "../utils.js";
const KEY = defaults.KEY;

/** @type {Predicate} */
const defined = function (value, key = KEY) {
  if (typeof value !== "undefined") return value;
  throw TypeError(`Expected {${key}} to be defined. Given {${key}: ${value}}`);
};

/** @type {(expected: any) => Predicate} */
const setDefault = (def) => (value) => {
  defined(def, "default");
  return value || def;
};

const hasKeys = (keys) => (obj) => {
  let missingKeys = keys.filter((key) => prop in obj);
  if (missingKeys.length)
    throw TypeError(`Expected properties ${missingKeys} on the input object`);
};

export { defined, setDefault, hasKeys };
