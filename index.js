let pipe = (...fns) => x => fns.reduce((acc, f) => f(acc), x);

let isOptional = (key) => key.endsWith("?");
let removeMarker = (key) => key.slice(0, -1);

function validate(...predicates) {
  // compose predicate fns 
  let predicateFn = pipe(...predicates);

  return function validate(keys, customiseErrCb) {
    return function(obj, errCb) {
      try {
        // iterate thru the keys with values of the given obj.  
        // execute againts the given predicate to either return or throw
        for(let key of keys) {

          // handle optinal keys
          let optional = isOptional(key);
          key = optional ? removeMarker(key) : key;
          if(optional && obj[key] == undefined) continue;

          let value = obj[key];
          // invoke customErrCb if provided
          try {
            predicateFn({key, value});
          } catch(e) {
            if(customiseErrCb) throw customiseErrCb(e, {key, value})
            throw e;
          }
        }
      } catch(e) {
        if(errCb) return errCb(e);
        throw e;
      }
      return obj;
    }
  }

};


function composeValidators(...validators) {
  let validateFn= pipe(...validators);
  return function validate(obj, errCb) {
    let validObj = obj;
    try {
      validObj = validateFn(obj);
    } catch(e) {
      if(errCb) return errCb(e);
      throw e;
    }
    return validObj;
  }
}


module.exports = {
  validate, 
  composeValidators
}
