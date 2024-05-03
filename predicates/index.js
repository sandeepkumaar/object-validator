const stringPredicates = require("./string");
const numberPredicates = require("./number");
const booleanPredicates = require("./boolean");
const datePredicates = require("./date");
const regexPredicates = require("./regex");

/**
 * @typedef {<T>(value: T, key?: string) => T | never} Predicate
 */

module.exports = {
  ...stringPredicates,
  ...numberPredicates,
  ...booleanPredicates,
  ...datePredicates,
  ...regexPredicates,
};
