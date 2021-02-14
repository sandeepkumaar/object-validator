# object-validator
Functions over Object Schemas, composable assertions, customizable errors - validator for JS objects

## How it is different from others
- Every schema based validation library has their own way of constructing the schema. It introduces a DSL and requires some knowledge on the docs. 
see: [validator](#Simple validator)
- Duplicate declarations. When multiple props share the same validations, they are required to be specified for each props. 
see: [validator](#Simple validator)
- They usally have their own validation system, their own way of throwing/returing validation errors/success. 
see:  [customError](#Custom validation error)
- Since Validation libs has their own validation system and includes many validators built in. they are usually bigger in size.
It may be an overkill for front-end apps that may only need typecheck or few basic validations. 
see:  [extend with other libs](#Extending with other validation modules)
- Schema configurations become difficult/not possible if we want to validate based on other properties in the object. 
see: [compare props](#Comparing props)
- Most schema validation libs dont care much on sanitizing the props. Like assigning sensible defaults. see: [assign defaults](assign defaults)
- The results of the validation usually they requires another conditional check to determine the flow
Eg: 
```
let result = xLibvalidate();
if(!result.error) {
  // u r good to go
} else {
  // throw or return 
}
```
see: [idiomatic usage](#Idiomatic usage)

## Usage
```javascript
const {validate, composeValidators, pipe } = require('@sknk/object-validator');
const {validate, composeValidators, pipe } = require('./');
const { string, maxString, minNumber, minDate, maxDate, boolean } = require('@sknk/object-validator/predicates');
const isEmail = require('validator/lib/isEmail');

// wrap as a predicate fn
let email = (pair) => {
  let {key, value} = pair;
  if(isEmail(value)) return pair;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
};

const user = {
  name: 'sandeep',
  age: 24,
  city: 'cbe',
  purchaseDate: '02/14/2021',
  expiryDate: '02/15/2025',
  email: 'cskumaar1992@gmail.com'
};

let validateExpiryDate = (user) => {
  let {purchaseDate, expiryDate} = user;
  let bool = new Date(purchaseDate) < new Date(expiryDate)
  if(bool) return user; // dont forget to return the entire obj
  throw TypeError('Invalid Expiry. Expiry date is before the purchase date');
};



let assignDefaults = ({isPremium=false, ...rest}) => ({...rest, isPremium});

const validateUser = composeValidators(
  validate(string)(["name", "city", "email"]),
  validate(maxString(3))(["city"]),
  validate(minNumber(18))(["age"], (e) => "User's age should be 18 or above"),
  validate(
    minDate("01/01/2020"),
    maxDate("12/31/2029")
  )(["purchaseDate", "expiryDate"]), // checks if dates fall within the date range
  validate(email)(["email"]),
  validate(boolean)(["isPremium?"]),
  validateExpiryDate,
  assignDefaults
);

var _user = validateUser(user); // throws error on failure; returns user obj on success
_user = validateUser(user, (e) => false) // returns false on failure; returns user obj on success

```

## API
### validate(...predFns)(keys, [cb])(obj)
`validate()()()` is a curry function that takes 3 args
`PredFns` single or mulitiple Predicate functions that either throws or returns args  
`keys` Array of Object keys to validate in an object
`cb` an optional cb to *throw* custom error on failure
`obj` object to validate

### composeValidators(...validators)([cb])
takes a single or multiple validator functions  and an optional `cb` to *return/throw*  any value

### pipe(...fns)
used to compose predicate functions



## Explanations with examples

### Simple validator

```
// returns arg or throws error
validateString  = validate(function isString({key, value}) {
  if(typeof value == "string") return {key, value};
  throw TypeError(`Expected ${key} to be string. Given ${value}`);
});
```
Predicate function 
- should be a pure, identity(a function which returns the same value you pass in) function
- throws error on failed validation
- takes a key-value pair of an object property to validate. 
This allows the predicate function to be composable with other predicates which we will 
see in later sections

```
validateStringProps = validateString(["name", "city"]);
```
validate the string properties in an object.

```
let obj = validateStringProps({
  name: "sandeep",
  age: 24,
  city: "cbe"

});
```
Pass the object to validate. This will validate only `name, city` props to be strings.
When validation fails it throws error.

Note: 
Using curried function allows us to get these partial functions that can be applied to 
different sets facilitating max reusablity.

### compose multiple predicate fn 
```
let minString5  = (args) => {
  let {key, value} = args;
  if(value.length >= 5) return args;
  throw TypeError(`Expected {${key}} to be of minimum length 5. Given {${key}: ${value}}`);
};

validateMinString = validate(isString, minString5);
obj = validateMinString(["name", "city"])({obj});
```
`validateMinString` fn validate obj props to be a string of min length 5 


### Optional props
Make props optional by suffixing the prop nam with "?"
```
validateStringProps(["name", "age", "city?"]);
```
this will validate the city only if its exists. else it will skip.


Now we have the capability to use/compose predicates into a **validator** function 
that can be  applied to multiple similar props in an object

### Custom validation error
You can also throw custom error overiding what predicate function throws
```
let validateStringProps = validateString(["name", "city", "age"], function(e, pair) {
  console.log("predicate's err", e);
  return `Error in ${pair.key} ${pair.value}`
});
validateStringProps(obj); // throws Error in age 24
```
The error function is given as second arg. Note: whatever you return in that function gets thrown.

### Compose validators
Lets compose different types of **validators** to apply them to different prop types in an object
```
let validationSchema = composeValidators(
  validate(string)(["name", "city"]),
  validate(number)(["age"])
);
validationSchema(obj); // returns {name, age, city}
```
if validataton fails for age then error thrown as
```
TypeError: Expected {age} to be of type Nuber. Given {age: "x"}
```

### Silence throw and return custom value
`validationSchema` throws error when validation fails. You can hook this by providing a
callback fuction
```
let op = validationSchema(obj, function(e) {
  return false;
}); 
op; // false
//or 
let op = validationSchema(obj, function(e) {
   e.statusCode = 400;
   throw e;
}); 
```
callback fn is supplied with error thrown by the validator. you can either return a value or 
rethrow with more error info

### Comparing props
`composeValidator` is a *pipe* function that supplies the same obj to all the validators in the array
we write a custom function that takes the object and perform validation by comparing props
Note: the custom function should follow the rules of composability. ie. pure, identity function
```
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

let validationSchema = composeValidators(
  validate(string)(["name", "city?"]),
  validate(number)(["age"]),
  checkDate // validate by comparing startDate, endDate values
);
validationSchema(obj);
```
### assign defaults
```
let assignDefaults = ({city="chn", ...rest}) => ({city, ...rest})
let validate = composeValidators(
  validate(string)(["name", "city?"]),
  validate(number)(["age"]),
  assignDefaults,
);
validate(obj);
```

#### Predicates
we have some most often used predicate functions as part of this module.
```
import * from "@sknk/object-validator/predicates";
```
you can find them in `./predicates/*`


### Extending with other validation modules
Since `object-validator` is simply an orchestration around the validation 
functions you can use any other lib functions.

```
const isEmail = require('validator/lib/isEmail');

// wrap as a predicate fn
let email = (pair) => {
  let {key, value} = pair;
  if(isEmail(value)) return pair;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
};
```


#### Idiomatic usage
We also export `pipe` function that comes handy when you want to separate the logic and 
argument validation in a function.
Eg:
```
let add = ({a, b}) => a + b;
let validate = validateNumber(["a", "b"]);

export pipe(validate, add);
```
The imported `add` function when called it first validates and then runs add logic.

In Express apps, you can validate request data as such
```
app.post("/", function(req, res, next) {
  let body = validateReq(req.body, function(e) {
    e.statusCode = 400;
    e.status = "BAD_REQUEST";
    throw e;
  });
})
```
when error is thrown, express common error handler is called that returns the error props.


## license
MIT
