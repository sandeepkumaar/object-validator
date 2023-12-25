/**
 *
*/




/**
 * Function takes the predicates and returns a partial function which can be passed with the 
 * value to validate. 
 *
 * @type {(predicates: Array<Predicate>, decorateError?: DecorateError) => CoreValidator} 
 * @param predicates - predicate functions to validate 
 * @param decorateError - Optional decorator when error is thrown by predicates
 * @returns partial function that takes the value to validate
 *
*/
const validate = function(predicates, decorateError) {
  return function(value) {
    for(let predicate of predicates) {
      try {
        return predicate(value);
      } catch(e) {
        throw e;
      }
    }
  }
};


export {
  validate
}








