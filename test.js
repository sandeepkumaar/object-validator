const { describe, Try } = require("riteway");
const { validate, composeValidators } = require("./");
const { string, minString, number } = require("./predicates");

let obj = {
  name: "sandeep",
  age: 24,
  city: "cbe"
};
console.log("obj =",obj);
/**
 * validate
 */
describe("validate()()()", async function(assert) {
  let validateString = validate(string);

  { // passing validation
    let keys = ["name", "city"];
    let validateStringProps = validateString(keys);
    assert({
      given: `validate(string)([${keys}])(obj)`,
      should: "return obj",
      actual: validateStringProps(obj),
      expected: obj
    });
  }
  { // failing validation
    let keys = ["name", "age"];
    let validateStringProps = validateString(keys);
    assert({
      given: `validate(string)([${keys}])(obj)`,
      should: "throw Error expecting string for age",
      actual: Try(validateStringProps, obj).toString(),
      expected: "TypeError: Expected {age} to be of type string. Given {age: 24}"
    });

  }

  { // optional props
    let keys = ["name", "city?", "address?"];
    let validateStringProps = validateString(keys);
    assert({
      given: `validate(string)([${keys}])(obj)`,
      should: "return obj",
      actual: validateStringProps(obj),
      expected: obj
    });
  }

  { // composing multilple predicates
   
    let validateStringProps = validate(string, minString(4))(["name", "city"]);
    assert({
      given: "validate(string, minString(4))(['name', 'city'])(obj)",
      should: "throw Error expecting city to be of minumum 4 chars",
      actual: Try(validateStringProps, obj).toString(),
      expected: "TypeError: Expected {city} to be of minimum length 4. Given {city: cbe}"
    })

  }

  { // throw custom error

    let validateStringProps = validateString(["name", "city", "age"], function(e, pair) {
      return `Error in ${pair.key} ${pair.value}`
    });
    assert({
      given: "validate(string)(['name', 'city', 'age'], errFn)(obj)",
      should: "throw Custom Error ",
      actual: Try(validateStringProps, obj).toString(),
      expected: "Error in age 24"
    })

  }
})


/**
 * composeValidator
 */
describe("composeValidators()()", async function(assert) {

  { // compose multipe validators: success
    let validationSchema = composeValidators(
      validate(string)(["name", "city"]),
      validate(number)(["age"])
    );
    assert({
      given: "composeValidators(string(name, city), number(age))(obj)",
      should: "return obj",
      actual: validationSchema(obj),
      expected: obj
    })

  }

  { // compose multipe validators: failure
    let validationSchema = composeValidators(
      validate(string)(["name", "city"]),
      validate(number)(["age", "name"])
    );
    assert({
      given: "composeValidators(string(name, city), number(age, name))(obj)",
      should: "throw Error expecting name to be of type number",
      actual: Try(validationSchema, obj).toString(),
      expected: "TypeError: Expected {name} to be of type number. Given {name: sandeep}"
    })
  }

  { // silence throw and return custom value
    let validationSchema = composeValidators(
      validate(string)(["name", "city"]),
      validate(number)(["age", "name"])
    );
    assert({
      given: "composeValidators(string(name, city), number(age))(obj, cb)",
      should: "return the cb value",
      actual: validationSchema(obj, function(e) {return false}),
      expected: false
    })
  }

  { // compare props

    let obj = {
      name: "sandeep",
      age: 24,
      startDate: "09/21/2020",
      endDate: "09/16/2020"
    };
    console.log("obj: ", obj);
    let checkDateInterval = (o) => {
      let { startDate, endDate } = o;
      if(new Date(startDate) < new Date(endDate)) return o;
      throw TypeError("startDate is after the endDate");
    };

    let validationSchema = composeValidators(
      validate(string)(["name", "city?"]),
      validate(number)(["age"]),
      checkDateInterval,
    );

    assert({
      given: "composeValidators(string(name, city), number(age), checkDateInterval)(obj)",
      should: "throw Error startDate is after the endDate",
      actual: Try(validationSchema, obj).toString(),
      expected: "TypeError: startDate is after the endDate"
    })
  }

  { // assign defaults
    let assignDefaults = ({address="kumudham", ...rest}) => ({address, ...rest})
    let validationSchema = composeValidators(
      validate(string)(["name", "address?"]),
      validate(number)(["age"]),
      assignDefaults,
    );

    assert({
      given: "composeValidators(string(name, city), number(age), assignDefaultAddress)(obj)",
      should: "return obj with default address",
      actual: validationSchema(obj),
      expected: {
        ...obj,
        address: "kumudham"
      }
    })

  }

});

