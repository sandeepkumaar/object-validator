import { isOptional, removeOptionalMark, defaults } from "./utils.js";
/**
 * @typedef {Error & {key?: string, value?: any, predicate?: string}} CustomError
 * @typedef {(err: Error) => Error} ThrowableFunction
 * @typedef {(arg0: any, key?: string) => any | never} Predicate
 */

/**
 * Core validator throws on validation failure or returns the value on success
 * @param predicates - Array of predicates where value is passed against
 * @param [decorateError] - Optional Error handler to add/simplify error info. it always throws whats returned
 * @param value - value to validate
 * @param [key] - Optional key supplied by composeValidator for objects
 *
 * @type {(predicates: Predicate[], decorateError?: ThrowableFunction) => Predicate}
 */
const validator = (predicates, decorateError) => (_value, key) => {
  //console.log('input', predicates, decorateError, value, key);
  let value = _value;
  for (let predicate of predicates) {
    try {
      value = predicate(value, key);
    } catch (e) {
      /** @type {CustomError} */
      let err = e instanceof Error ? e : Error(String(e));
      // replace 'input' with custom key provided
      err.message =
        key && err.message.includes(defaults.KEY)
          ? err.message.replaceAll(defaults.KEY, key)
          : err.message;
      err.key = key; // will be undefined when no key provided
      err.value = value;
      err.predicate = predicate.name;
      if (decorateError) {
        err = decorateError(err);
      }
      throw err;
    }
  }
  return value;
};

const strictKeyMatch = function (o1 = {}, o2 = {}) {
  let setO2 = new Set(Object.keys(o2));
  let additionalKeys = Object.keys(o1).filter((k) => !setO2.has(k));
  if (additionalKeys.length)
    throw TypeError(`UnExpected keys [${additionalKeys}]`);
  return o2;
};

/**
 * New object is returned. keys are
 * @param schema - schema object used to declare the validators
 * @param obj - Input obj
 * @param [opts] - Option to aggregateError
 * @type {(schema: Record<string, Predicate>) =>
 * (obj: Record<string, any>, opts?: typeof defaults.schemaOpts) => Record<string, any> | never}
 */
const vSchema =
  (schema) =>
  (obj, opts = defaults.schemaOpts) => {
    let newObj = {};
    let { aggregateError = false, strict = true } = opts;
    let aggregateErrors = [];

    for (let [key, validator] of Object.entries(schema)) {
      // handle Optional keys - remove'?' and skip check if undefined
      if (isOptional(key)) {
        key = removeOptionalMark(key);
        if (obj[key] === undefined) continue;
      }
      let value = obj[key];
      try {
        // @ts-ignore
        newObj[key] = validator(value, key);
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
    if (strict) {
      try {
        strictKeyMatch(obj, newObj);
      } catch (e) {
        if (aggregateError) {
          aggregateErrors.push(e);
        } else {
          throw e;
        }
      }
    }
    if (aggregateErrors.length) {
      let e = new AggregateError(aggregateErrors, "vSchema Errors");
      throw e;
    }
    return newObj;
  };

/**
 * @typedef {<T extends Record<string, any>>(obj: T, opts?: typeof defaults.schemaOpts) => T | never} Validator
 * @type {<T extends object>(...validators: Validator[]) => (_obj: T, opts?: typeof defaults.composeOpts) => T | never}
 */
const composeValidators =
  (...validators) =>
  (_obj, opts = defaults.composeOpts) => {
    // check inputs
    let obj = _obj;
    let { aggregateError = false, onError } = opts;
    /** @type AggregateError[]*/
    let aggregateErrors = [];
    for (let validator of validators) {
      try {
        obj = validator(obj, { aggregateError });
      } catch (e) {
        if (aggregateError) {
          aggregateErrors =
            e instanceof AggregateError
              ? [...aggregateErrors, ...e.errors]
              : [...aggregateErrors, e];

          continue;
        }
        if (onError) {
          return onError(e);
        }
        throw e;
      }
    }
    if (aggregateErrors.length) {
      let e = new AggregateError(aggregateErrors, "composeValidator Errors");

      if (onError) {
        return onError(e);
      }
      throw e;
    }
    return obj;
  };

export {
  validator as v, // this for is for single argument validator
  vSchema, // rename this to vObject
  composeValidators,
};
