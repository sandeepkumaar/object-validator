import { isOptional, removeOptionalMark, defaults } from './utils.js';

/*
/**
 * Creates a closure with predicates
 * @param {Function[]} predicates - Array of predicates
 * @param {Function} [decorateError] - Optional decorater that adds key, value, predicate used which failed
 * @returns {Function} _validator - closure function that iterates the value against the predicates
*/
//const validator = function(predicates, decorateError) {
//  return function _validator(value) {
//    let {key} = this || defaultKey;
//    for(let predicate of predicates) {
//      try {
//        return predicate(value);
//      } catch(e) {
//        // addtional error info
//        if(e instanceof Error) {
//          e.key = key;
//          e.value = value;
//          e.predicate = predicate.name
//        }
//        if(decorateError) decorateError(e);
//        throw e;
//      }
//    }
//  }
//}

const validator = (predicates, decorateError) => ( value, key=defaults.KEY) =>  {
  //console.log('input', predicates, decorateError, value, key);
  for(let predicate of predicates) {
    try {
      predicate(value, key);
    } catch(e) {
      // addtional error info
      if(e instanceof Error) {
        e.key = key;
        e.value = value;
        e.predicate = predicate.name
      }
      if(decorateError) decorateError(e);
      throw e;
    }
  };
  return value;
};

//const vSchemaOpts = { accumulateError: false };
const vSchema = (schema, opts=defaults.schemaOpts) => (obj) => {
  let {aggregateError} = opts;
  let aggregateErrors = [];
  for(let [key, validator] of Object.entries(schema)) {
    // handle Optional keys - remove'?' and skip check if undefined
    if(isOptional(key)) {
      key = removeOptionalMark(key);
      if(obj[key] === undefined) continue;
    };
    let value = obj[key];
    try{
      validator(value, key);
    } catch(e) {
      if(aggregateError) {
        aggregateErrors.push(e);
        continue;
      };
      throw e
    };
  }
  if(aggregateErrors.length) {
    throw new AggregateError(aggregateErrors, 'vSchema Errors');
  }
  return obj;
}

const composeValidators = (validators, opts=defaults.composeOpts) => (_obj, onError) => {
  // check inputs
  let obj = _obj;
  let {aggregateError} = opts;
  let aggregateErrors = [];
  for(let validator of validators) {
    console.log(validator);
    try {
      obj = validator(obj, opts);
    } catch(e) {
      if(opts.aggregateError) {
        aggregateErrors.push(e);
        continue;
      }
      throw e;
    }
  };
  if(aggregateErrors.length) {
    throw new AggregateError(aggregateErrors, 'composeValidator Errors');
  }
  return obj;

}
  

export {
  validator as v,
  vSchema,
  composeValidators
}


/**
 * TODO
 * Composable predicates
 *  - Error key will be added from the lib thru regex pattern
 * simplify functions
 *
 *
 *
 *
*/

//let validator = composeValidators([
//  vSchema({
//    'name': v([string, maxString(3)], (e) => {/*optional error decorator*/throw e}),
//    'age': v([number]),
//    'address?': v([string]),
//  }),
//  compareDates, // (date1, date2) => thrwo
//  assignDefaults
//], { aggregateError: true});
//
//let validator = composeValidators([
//  vObj({
//    'name': [string, maxString(3), (e) => {/*optional error decorator*/throw e}],
//    'age': [number],
//    'address?': [string],
//  }),
//  compareDates, // (date1, date2) => thrwo
//  assignDefaults
//], { aggregateError: true});
