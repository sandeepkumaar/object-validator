export * from "./predicates/index.js";
import { parsePredicates, strictKeyMatch } from "./utils.js";
// @ts-ignore
import check from "tiny-schema";

/** @type {(i: any) => any} */
const identity = (i) => i;

/**
 * @typedef {(arg0: any, key?: string) => any | never} Predicate
 *
 * @typedef {Error & {key?: string, value?: any, predicate?: string}} CustomError
 *
 * @typedef {{
 *  aggegateError?: boolean,
 *  strict?: boolean,
 *  handleError?: function
 *  pipeline?: function[]
 * }} ValidatorOpts
 *
 * @typedef {{
 *  strict?: boolean,
 *  aggregateError?: boolean
 * }} SchemaOpts
 *
 * @typedef {{ errCb?: (i: any) => any|never, optKey?: boolean}} ValidateOpts
 *
 * @typedef {Array<Predicate | string | ValidateOpts> | string | function} PredicateArray
 * @typedef {Record<string, any>} Object
 * @typedef {Record<string, PredicateArray>} Schema
 */

/**
 * predicates can be single predicate, arrary of predicates, predicates with obj
 * @type {(_predicates: PredicateArray, value: any, key?: string, errCb?: function) => any}
 */
const validate = function validate(predicates, value, key, errCb = identity) {
  for (let predicate of /** @type {Predicate[]}*/ (predicates)) {
    try {
      value = predicate(value, key);
    } catch (e) {
      /** @type {CustomError} */
      let err = e instanceof Error ? e : Error(String(e));
      err.key = key; // will be undefined when no key provided
      err.value = value;
      err.predicate = err.predicate || predicate.name;
      err = errCb(err);
      throw err;
    }
  }
  return value;
};

/**
 * @type {(obj: Record<string, any>, schema: Record<string, PredicateArray>, opts?: SchemaOpts) => Record<string, any>}
 */
function schemaValidator(obj, schema, opts = {}) {
  /** @type {Record<string, any>} */
  let newObj = {};
  let { aggregateError = false, strict = true } = opts;
  let aggregateErrors = [];

  // get schema entries
  for (let [_key, _predicates] of Object.entries(schema)) {
    let { predicates, key, opts } = parsePredicates(_predicates, _key);
    let { errCb, optKey = false } = opts;

    // handle Optional keys - remove'?' and skip check if undefined
    if (optKey && obj[key] === undefined) continue;

    let value = obj[key];
    try {
      newObj[key] = validate(predicates, value, key, errCb);
    } catch (e) {
      if (aggregateError) {
        // @ts-ignore
        newObj[key] = value; // for strictKey check when aggregateError is true
        aggregateErrors.push(e);
        continue;
      }
      throw e;
    }
  }
  // strict key match check
  try {
    newObj = strictKeyMatch(obj, newObj, strict);
  } catch (e) {
    if (aggregateError) {
      aggregateErrors.push(e);
    } else {
      throw e;
    }
  }

  if (aggregateErrors.length) {
    let e = new AggregateError(aggregateErrors, "schemaValidator Errors");
    throw e;
  }
  return newObj;
}

/** @type {(fns: function[]) => (input: any) => any | never } */
export const pipe = (fns) => (input) => {
  return fns.reduce((acc, fn) => fn(acc), input);
};

/**
 * @type {(obj: Object, schema: Schema , opts: ValidatorOpts)  => Object}
 */
export default function validator(obj, schema, opts = {}) {
  if (!check("object")(obj))
    throw TypeError(`Expected input to be an object. Given ${obj}`);
  if (!check("object")(schema))
    throw TypeError(`Expected schema to be an object. Given ${schema}`);
  let { handleError, pipeline = [], ...restOpts } = opts;
  let validators = [
    /** @param {any}  o*/
    (o) => schemaValidator(o, schema, restOpts),
    ...pipeline,
  ];
  try {
    //obj = _validator(obj, schema, restOpts);
    return pipe(validators)(obj);
  } catch (e) {
    if (handleError) return handleError(e);
    throw e;
  }
}
