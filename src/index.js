import { isOptional, removeOptionalMark, defaults } from "./utils.js";

/*
/**
 * Creates a closure with predicates
 * @param {Function[]} predicates - Array of predicates
 * @param {Function} [decorateError] - Optional decorater that adds key, value, predicate used which failed
 * @returns {Function} _validator - closure function that iterates the value against the predicates
*/

const validator = (predicates, decorateError) => (value, key) => {
  //console.log('input', predicates, decorateError, value, key);
  for (let predicate of predicates) {
    try {
      predicate(value);
    } catch (e) {
      // addtional error info
      if (e instanceof Error) {
        // replace 'input' with custom key provided
        e.message =
          key && e.message.includes(defaults.KEY)
            ? e.message.replaceAll(defaults.KEY, key)
            : e.message;
        e.key = key; // will be undefined when no key provided
        e.value = value;
        e.predicate = predicate.name;
      }
      if (decorateError) decorateError(e);
      throw e;
    }
  }
  return value;
};

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

const composeValidators =
  (validators) =>
  (_obj, opts = defaults.composeOpts) => {
    // check inputs
    let obj = _obj;
    let { aggregateError, onError } = opts;
    let aggregateErrors = [];
    for (let validator of validators) {
      try {
        obj = validator(obj, opts);
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
