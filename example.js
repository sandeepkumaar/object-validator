import {v, vSchema, composeValidators} from './src/index.js';
import {
  string,  
  number,
  maxString,
  minString,
  minNumber,
} from './src/predicates/index.js';

/*
let personSchema = vSchema({
  'name': string,
  'age?': number
})

{ // throw on schema validation error
  try {
    let person = personSchema({
      name: 'sandeep',
      age: '24' // throws erro
    });
  } catch(e) {
    console.error(e) // TypeError: Expected {age} to be number. Given {age: 24}
  }
}

{ // optional key handling
  let person = personSchema({
    name: 'sandeep',
  });
  console.log(person); // prints
}

// advanced schema - pipe predicates, custom error, aggregateError
let personSchema1 = vSchema({
  'name': v([string, maxString(7)]),
  'age?': v([number, minNumber(18)]),
  'city?': v([string, minString(3), maxString(5)], (e) => {
    e.message = 'some custom message'
    return e;
  }),
})

{  // pipe predicates
  try {
    let person = personSchema1({
      name: 'sandeep',
      age: 7 // throws error
    });
  } catch(e) {
    console.error(e); // TypeError: Expected {age} to be greater than or equal to 18. Given {age: 7}
  }
}

{  // custom error
  try {
    let person = personSchema1({
      name: 'sandeep',
      age: 24,
      city: 'coimbatore'
    });
  } catch(e) {
    console.error(e); // TypeError: some custom message
  }
}
  */
{  // aggregate Error
  // advanced schema - pipe predicates, custom error, aggregateError
  let personSchema1 = vSchema({
    'name': v([string, maxString(7)]),
    'age?': v([number, minNumber(18)]),
    'city?': v([string, minString(3), maxString(5)], (e) => {
      e.message = 'some custom message'
      return e;
    }),
  })
  try {
    let person = personSchema1({
      name: 'sandeep',
      age: 24,
      city: 'cbe',
      xxx: 'sdf'
    }, { // optional
      //aggregateError: true,
      //strict: false,
    });
  } catch(e) {
    console.error(e); // Aggregate Error: vSchema Errors
  }
}

{ // compose validators for Error handling, compare fields, modify data if necessary
  let composedSchema = composeValidators(
    personSchema1,
    function compare(obj) {
      let {born, graduated} = obj;
      if(new Date(born) < new Date(graduated)) throw TypeError('Birthdate should be before graduated date');
      return obj; // make sure to return the obj
    }
  );
  let obj = {
    name: 'sandeep',
    age: 7,
  };
  try {
    composedSchema(obj, {aggregateError: true});
  } catch(e) {
    console.error(e);
  }
  let bool = composedSchema(obj, {
    aggregateError: true,
    onError: (e) => false
  });
  console.log(bool);

};





