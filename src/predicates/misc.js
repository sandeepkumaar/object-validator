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

/** @type {(keys: string[], obj: object) => typeof obj | never}*/
const hasKeys =
  (keys = []) =>
  (obj = {}) => {
    let missingKeys = keys.filter((key = "") => key in obj);
    if (missingKeys.length)
      throw TypeError(`Expected properties ${missingKeys} on the input object`);
    return obj;
  };

const pick =
  (keys = []) =>
  (obj = {}) => {
    return keys.reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
  };

export { defined, setDefault, hasKeys, pick };
