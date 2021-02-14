const { validate, composeValidators } = require("./");
/**
 * validate
 */
let validateString  = validate(function stringValidator(pair) {
  let { key, value } = pair;
  if(typeof value === "string") return arguments[0]; // return the input args.
  throw TypeError(
    `Expected {${key}} to be of type String. Given {${key}: ${value}}`
  );
});
let obj = {
  name: "sandeep",
  age: 24,
  city: "cbe"
}

{ // check string props 

  let validateStringProps = validateString(["name", "city"]);
  let output = validateStringProps(obj);
  console.log("validation result", output); // prints { name, age, city }
}

{ // throw error when validation error

  let validateStringProps = validateString(["name", "city", "age"]);
  try {
    let output = validateStringProps(obj);
  } catch(e){ 
    console.log("validation error", e) // throws error
  };

}

{ // optional props. validate only if optional props exists
  let obj = { name: "sandeep", age: 24 };
  let validateStringProps = validateString(["name?", "city?"]);
  let op = validateStringProps(obj);
  console.log("optional props", op); // {name, age}
}

{ // composing multiple predicates
  let string = (pair) => {
    let {key, value} = pair;
    if(typeof value === "string") return pair;
    throw TypeError(`Expected {${key}} to be of type String.  Given {${key}: ${value}}`);
  };
  let minString5  = (args) => {
    let {key, value} = args;
    if(value.length >= 5) return args;
    throw TypeError(`Expected {${key}} to be of minimum length 5. Given {${key}: ${value}}`);
  }
  try {
    let op = validate(string, minString5)(["name", "city"])(obj);
  } catch(e) { console.log("multiple validators", e) } // throws error


}


{ // throw custom error
  let validateStringProps = validateString(["name", "city", "age"], function(e, pair) {
    console.log("original err", e);
    return `Error in ${pair.key} ${pair.value}`
  });
  try {
    let output = validateStringProps(obj);
  } catch(e){ 
    console.log("validation error", e) // throws error
  };
}

{ // using 3rd party validator is-equal
  const isEqual = require("is-equal");
  let equals = (expected) => (pair) => {
    let { key, value } = pair;
    if(isEqual(value, expected)) return pair;
    throw TypeError(`Expected {${key}} to be equal to ${JSON.stringify(expected)}. Given {${key}: ${JSON.stringify(value)}}`);
  };
  let obj = {
    nested: {
      name: "sandeep"
    }
  };
try {
  let output = validate(equals({ name: "navin" }))(["nested"])(obj);
} catch (e) {
  console.log("validation error", e);
}

}


/**
 * composeValidators
 */
let string = (pair) => {
  let {key, value} = pair;
  if(typeof value === "string") return pair;
  throw TypeError(`Expected {${key}} to be of type String.  Given {${key}: ${value}}`);
};
let number = (pair) => {
  let { key, value } = pair;
  if(typeof value === "number") return arguments[0];
  throw TypeError(`Expected {${key}} to be of type Number. Given {${key}: ${value}}`);
}
{ // compose multipe validators: success
  let validationSchema = composeValidators(
    validate(string)(["name", "city"]),
    validate(number)(["age"])
  );

  let op = validationSchema(obj);
  console.log("compose: succcess case", op);
  
}
{ // compose multipe validators: failure
  let validationSchema = composeValidators(
    validate(string)(["name", "city"]),
    validate(number)(["age", "name"])
  );

  try { 
    validationSchema(obj); 
  } catch(e) {
    console.log("compose: failure case", e);
  }
}

{ // silence throw and return custom value
  let validationSchema = composeValidators(
    validate(string)(["name", "city"]),
    validate(number)(["age", "name"])
  );

  let op = validationSchema(obj, function(e) {
    return false;
  }); 
  console.log("silence throw", op);
}

{ // compare props and assign defaults
  let obj = {
    name: "sandeep",
    age: 24,
    startDate: "09/21/2020",
    endDate: "09/16/2020"
  };

  let checkDate = (o) => {
    let { startDate, endDate } = o;
    if(new Date(startDate) < new Date(endDate)) return o;
    throw TypeError("startDate is after the endDate");
  };

  let assignDefaults = ({city="chn", ...rest}) => ({city, ...rest})

  let validationSchema1 = composeValidators(
    validate(string)(["name", "city?"]),
    validate(number)(["age"]),
    checkDate,
  );

  try {
    let op = validationSchema1(obj);
    console.log("compare props", op);
  } catch(e) {
    console.log("custom functions", e);
  }

  let validationSchema2 = composeValidators(
    validate(string)(["name", "city?"]),
    validate(number)(["age"]),
    assignDefaults,
  );
  try {
    let op = validationSchema2(obj);
    console.log("assign defaults", op);
  } catch(e) {
    console.log("assign defaults", e);
  }
}

