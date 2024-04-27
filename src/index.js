import { isOptional, removeOptionalMark, defaults } from "./utils.js";
/**
 * @typedef {Error & {key?: string, value?: any, predicate?: string}} CustomError
 * @typedef {(err: Error) => Error} ThrowableFunction
 * @typedef {() => any | never} PipeFns
 */

/**
 * Core validator throws on validation failure or returns the value on success
 * @param predicates - Array of predicates where value is passed against
 * @param [decorateError] - Optional Error handler to add/simplify error info. it always throws whats returned
 * @param value - value to validate
 * @param [key] - Optional key supplied by composeValidator for objects
 *
 * @typedef {import('./predicates/string.js').Predicate} Predicate
 * @type {(predicates: Predicate[], decorateError?: ThrowableFunction) => Predicate}
 */
const validator = (predicates, decorateError) => (value, key) => {
  //console.log('input', predicates, decorateError, value, key);
  for (let predicate of predicates) {
    try {
      predicate(value, key);
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

/**
 * @param schema - schema object used to declare the validators
 * @param obj - Input obj
 * @param [opts] - Option to aggregateError
 * @type {<T extends Record<string, any>>(schema: Record<string, Predicate>) =>
 * (obj: T, opts?: typeof defaults.schemaOpts) => T | never}
 */
const vSchema =
  (schema) =>
  (obj, opts = defaults.schemaOpts) => {
    let { aggregateError } = opts;
    let aggregateErrors = [];
    for (let [key, validator] of Object.entries(schema)) {
      // handle Optional keys - remove'?' and skip check if undefined
      if (isOptional(key)) {
        key = removeOptionalMark(key);
        if (obj[key] === undefined) continue;
      }
      let value = obj[key];
      try {
        validator(value, key);
      } catch (e) {
        if (aggregateError) {
          aggregateErrors.push(e);
          continue;
        }
        throw e;
      }
    }
    if (aggregateErrors.length) {
      throw new AggregateError(aggregateErrors, "vSchema Errors");
    }
    return obj;
  };

/**
 * @typedef {<T extends Record<string, any>>(obj: T, opts?: typeof defaults.schemaOpts) => T | never} Validator
 * @type {<T extends object>(validators: Validator[]) => (_obj: T, opts?: typeof defaults.composeOpts) => T | never}
 */
const composeValidators =
  (validators) =>
  (_obj, opts = defaults.composeOpts) => {
    // check inputs
    let obj = _obj;
    let { aggregateError, onError } = opts;
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
