import { isOptional, removeOptionalMark } from "./utils.js";
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
 * @typedef {{ errCb?: function}} ValidateOpts
 *
 * @typedef {Array<Predicate | ValidateOpts>} PredicateArray
 * @typedef {Record<string, any>} Object
 * @typedef {Record<string, PredicateArray>} Schema
 */

const strictKeyMatch = function (o1 = {}, o2 = {}) {
  let setO2 = new Set(Object.keys(o2));
  let additionalKeys = Object.keys(o1).filter((k) => !setO2.has(k));
  if (additionalKeys.length)
    throw TypeError(`UnExpected keys [${additionalKeys}]`);
  return o2;
};

/**
 * predicates can be single predicate, arrary of predicates, predicates with obj
 * @type {(_predicates: PredicateArray, value: any, key?: string) => any}
 */
const validate = function validate(_predicates, value, key) {
  // handle different predicates scenarios
  let predicates = _predicates;
  /** @type {ValidateOpts} */
  let opts = {};
  let isArray = Array.isArray(predicates);
  let singlePred = typeof predicates === "function";

  if (!(isArray || singlePred))
    throw Error("Predicates should be an array or single predicate fn");

  if (singlePred) predicates = /** @type {PredicateArray} */ ([predicates]);
  // TODO: check predicates length before pop

  let { errCb } = /** @type {ValidateOpts} */ (
    predicates.length && typeof predicates.at(-1) == "object"
      ? predicates.pop()
      : opts
  );

  if (!predicates.length) throw Error("No predicates provided");

  if (!predicates.every((predicate) => typeof predicate == "function"))
    throw Error("Predicates should be a function");

  //console.log('predicate', predicates, value, key, errCb);
  for (let predicate of /** @type {Predicate[]}*/ (predicates)) {
    try {
      value = predicate(value, key);
    } catch (e) {
      /** @type {CustomError} */
      let err = e instanceof Error ? e : Error(String(e));
      err.key = key; // will be undefined when no key provided
      err.value = value;
      err.predicate = predicate.name;
      if (errCb) {
        err = errCb(err);
      }
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
  for (let [key, predicates] of Object.entries(schema)) {
    // handle Optional keys - remove'?' and skip check if undefined
    if (isOptional(key)) {
      key = removeOptionalMark(key);
      if (obj[key] === undefined) continue;
    }
    let value = obj[key];
    try {
      newObj[key] = validate(predicates, value, key);
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
    let e = new AggregateError(aggregateErrors, "schemaValidator Errors");
    throw e;
  }
  return newObj;
}

/** @type {(fns: function[]) => (input: any) => any | never } */
const pipe = (fns) => (input) => {
  return fns.reduce((acc, fn) => fn(acc), input);
};

/**
 * @type {(obj: Object, schema: Schema , opts: ValidatorOpts)  => Object}
 */
function validator(obj, schema, opts = {}) {
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

export { validate, schemaValidator, validator };

/*
try {
let value = validator({
  name: 'sandeep',
  age: 24,
  abc: 'a'
}, {
  name: [string, maxString(5), {errCb: (e) => {
    e.message = "custom message";
    e.key = "customErrorKey";
    return e;
  }}],
  age: [number, minNumber(18)],
  'city?': [string]
}, {
  aggregateError: true,
  strict: true,
  handleError: (e) => false
  pipeline: [() => {throw Error('dummy')}],
})
console.log(value);
} catch (e) {
  console.error(e);
}
*/
