## object-validator

Functional Object schema validator for objects, function arguments, UI form inputs, API request payload.  
Predicates are powered by [tiny-schema](https://www.npmjs.com/package/tiny-schema) package
- Composable predicates
- Customizable native errors
- Simple error handling 
- Integration with other validation libraries
- Minimal footprint 

## npm
Install: `npm install @sknk/object-validator`  
Test: `npm test`  
Run examples: `npm run example`  


## Basic usage

```
let obj = {
  name: 'john',
  age: 24
};

let schema = {
  name: ["string", "/^.{3,8}$/"],
  age: ["number", "18-24"],
};

obj = validator(obj, schema)
```
Throws error on validation failure. On success returns the object.



## Predicates & Transform pipelines 
Predicates can be *strings* from `tiny-schema` package. checkout out their readme for more predicates.     
**Custom predicates** are also supported. 
```
function string(value, key='input') {
  if(typeof value === 'string') throw Error('Expecting string. Given ${key}: ${value}');
  return value;
};
let schema = {
  name: [string, maxString(8)],
  age: ["number", "18-24"],
};
obj = validate(obj, schema);
```

- key - optional, will be passed by the validator
- predicate should return  or throw error 

**Transforms** are similar to function predicates which can tranform values
```
const setDefault = (def) => (value) => {
  return value || def;
};

let schema = {
  'name?': [setDefault('abc'), string, maxString(8)],
  age: ["number", "18-24"],
};
obj = validate({age: 24}, schema);
```

schema key validation pipelines are simple standalone functions. **no dependency** with the package which makes it lean 
and allows you to extend other validation libraries with custom errors.

## Schema pipeline opts - {errCb, opt}
- errCb : callback function that gets the error thrown by the validator from the pipeline. whatever errCb returns its thrown 
again by the validator internally. use this to decorateError
- opt: 2 ways to declare a key as *optional* key in schema
  - using "?" at the end of the key `{"name?": [sring]}`
  - using {opt=true} in the pipelines opts
  - default is opt: false

```
let schema = {
  'name?': [setDefault('abc'), string, maxString(8)],
  age: ["number", "18-24", (errCb: (e) => {
    e.message = 'age error';
    return e; // should return error
  }, 
  opt: true
  )],
};
```
## Errors
Errors thrown from validator are native Javascript Errors or whatever the error thrown by custom validator.   
`validator` function adds additional properties like `key`, `value`, `predicate` on the Error object
- key: object key on which validation is done
- value: actual object key value
- predicate: predicate function name or schema *string* used to perform validation

> Note: Only Schema errors will be supplied with additional properties.

TypeError
```
TypeError: Expected {age} to satisfy {18-24} validation. Given {age: 25}
    at getError (file://tiny-schema-wrapper.js:6:11)
    ...
  predicate: '18-24',
  key: 'age',
  value: 25
}
```
AggregateError
```
AggregateError: schemaValidator Errors
    at schemaValidator (file://index.js:137:13)
    ...
  [errors]: [
    TypeError: Expected {age} to satisfy {number} validation. Given {age: 25}
        at getError (file://..tiny-schema-wrapper.js:6:11)
        ...
      predicate: 'number',
      key: 'age',
      value: '25'
    },
    TypeError: Unexpected keys [abc]
        at strictKeyMatch (file:///home/sknk/sandeep/workspace/libraries/object-validator/src/index.js:34:11)
        ...
  ]
}
```

## API 
### validator(obj: object, schema: object, opt?: object) => object | Error
- obj - input object to validate
- schema - object with predicates on each key
- opt - Optional  { aggregareError=false, handleError: function, strict: true, pipeline: Predicate[]}

###  Validator opts 
#### aggreagateError
Default: false
when set to `true` it aggregates all the errors from the schema pipelines and throws an javascript `Aggregate Error`.  
Individual errors are found in `error.errors`

```
let o = validator(obj, schema, {aggreagateError: true})
```
#### handleError
Optional. When validator throws erorr ( both aggregate and single error) this function when provided gets invoked with the 
error object. function's return value will the returned by the validator.

```
let bool = validator(obj, schema, {handleError: (e) => false})
bool // false on validation failure
```
#### strict
By default, validator throws `Unexpected keys` error when there are keys which are not declared in the schema. to override
this use {strict: false}

```
let bool = validator(obj, schema, {strict: false}) // skips additional keys 
```
#### object pipeline
Post pipeline functions. these functions are run after schema validation is done. each function is passed with the object.
This is similar to pipe behaviour where we can do data transform or multiple fields compare and assert checks

```
let o = validator(obj, schema, { 
  pipeline: [
   (o) => {
     let {startDate, endDate} = o;
     if(startDate > endDate) throw Error('startDate cannot be greater than endDate');
     return o // always return input object or the transformed one
   },
   // another fn
   // ...
  ]
}
})
```
Schema can only check individual fields. This pipeline opts will allows us to validate togther as an object.

Note: 
- Errors thrown from object pipeline are handled by `handleError`
- other options like aggregateError, strict are only for schema validation

## TODO
- publish - commonjs
- merge
