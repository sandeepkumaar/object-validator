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

export { defined, setDefault };
