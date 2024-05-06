// @ts-ignore
import check from "tiny-schema";
import { is } from "./predicates/tiny-schema-wrapper.js";

/**
 * @typedef {import('./index.js').PredicateArray} PredicateArray
 * @typedef {import('./index.js').Predicate} Predicate
 */

export const defaults = {
  KEY: "input",
};
/** @type{(key: string) => boolean}*/
export const isOptional = (key) => key.endsWith("?");
/** @type{(key: string) => string}*/
export const removeOptionalMark = (key) => key.slice(0, -1);

export const strictKeyMatch = function (o1 = {}, o2 = {}, strict = true) {
  let setO2 = new Set(Object.keys(o2));
  let additionalKeys = Object.keys(o1).filter((k) => !setO2.has(k));
  if (strict && additionalKeys.length)
    throw TypeError(`Unrecognized keys [${additionalKeys}]`);
  let additionalObj = Object.fromEntries(
    // @ts-ignore
    additionalKeys.map((key) => [key, o1[key]]),
  );
  return { ...o2, ...additionalObj };
};

// @ts-ignore
export const parsePredicates = function (_predicates = [], _key = "") {
  let predicates = _predicates;
  let key = _key;
  let opts = {
    /** @param {any} i*/
    errCb: (i) => i,
    optKey: false,
  };
  let isArray = check("array")(predicates);
  let isFunction = typeof predicates == "function";
  let isString = check("string")(predicates);

  // predicates should be a tiny-schema string, function or array with minimum one predicates
  if (!(isString || isFunction || (isArray && predicates.length)))
    throw TypeError(
      `"${key}" should have either tiny-schema string or a function or an array with minimum one predicate`,
    );

  // if function or string, convert it to predicate array
  if (isFunction || isString) predicates = [predicates];
  let lastElement = predicates.at(-1);
  opts = check("object")(lastElement) ? predicates.pop() : opts;

  if (!predicates.length) throw TypeError(`No predicates found for "${key}"`);
  // map tiny-schema style scheme with wrapper

  predicates = predicates.map((predicate) => {
    if (check("string")(predicate)) return is(predicate);
    return predicate;
  });
  let invalidPredicates = predicates.filter(
    (predicate) => typeof predicate !== "function",
  );
  if (invalidPredicates.length)
    throw TypeError(`Invalid predicates ${invalidPredicates} for "${key}"`);
  // handle Optional keys - remove'?' and skip check if undefined
  let isOptionalKey = isOptional(key);
  key = isOptionalKey ? removeOptionalMark(key) : key;

  opts.optKey = opts.optKey || isOptionalKey;

  return { predicates, opts, key };
};
