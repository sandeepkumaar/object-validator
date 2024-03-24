import {test} from 'node:test'
import assert from 'node:assert';
import tryCatch from 'try-catch';
import { string, defined, number } from './predicates/string.js';
import {v, vSchema, composeValidators } from './index.js';


test('v(predicates[]: fn, decorateError?: fn)(value: any, key?: string) => any', async (t) => {

  await t.test('Given predicates: [defined, string], value: "x" ; should return "x"', () => {
    assert.deepStrictEqual(v([defined, string])('x'),'x');
  })

  await t.test('Given predicates: [defined, string], value: undefined ; should throw undefined TypeError', () => {
    let [error] = tryCatch(v([defined, string]), undefined);
    assert.deepStrictEqual(error?.toString(), 'TypeError: Expected {input} to be string. Given {input: undefined}');
  })

  await t.test('Given predicates: [defined, string], value: "x", key: undefined ; should throw TypeError with default key', () => {
    let [error, result] = tryCatch(v([defined, string]), 1);
    assert.deepStrictEqual(error.message,'Expected {input} to be string. Given {input: 1}');
    assert.deepStrictEqual(error.key, undefined);
  })
  await t.test('Given predicates: [defined, string], value: "x", key: "customKey" ; should throw TypeError with addnProps', () => {
    let [error, result] = tryCatch(v([defined, string]), 1, 'customKey');
    assert.deepStrictEqual(error?.toString(),'TypeError: Expected {customKey} to be string. Given {customKey: 1}');
    assert.deepStrictEqual(error.key,'customKey');
    assert.deepStrictEqual(error.value, 1);
    assert.deepStrictEqual(error.predicate,'string');
  })

  await t.test('Given predicates: [defined, string], decorateError: fn, value: undefined ; should throw custom Error', () => {
    let [error] = tryCatch(v([defined, string], (e) => {
      e.message = 'customError message';
      e.key = 'customErrorKey'
    }), undefined);
    assert.deepStrictEqual(error?.toString(), 'TypeError: customError message');
    assert.deepStrictEqual(error?.key, 'customErrorKey');
  })

})

test('vSchema(schema: object, opts: object, obj: object) => object', async (t) => {
  await t.test('Given schema:{name: string, age: number}, obj: {name: "x", age: 24} ; should return obj', () => {
    let obj = { 
      name: 'x',
      age: 24,
    };
    let actual = vSchema({
      'name': v([defined, string]),
      'age': v([defined, number])
    })(obj);
    assert.deepStrictEqual(actual, obj);
  })

  await t.test('Given schema:{name: string, age: number}, obj: {name: "x", age: "24"} ; should throw Age Error', () => {
    let obj = { 
      name: 'x',
      age: '24',
    };
    let validator = vSchema({
      'name': v([defined, string]),
      'age': v([defined, number])
    });
    let [error] = tryCatch(validator, obj);
    assert.deepStrictEqual(error?.toString(), 'TypeError: Expected {age} to be number. Given {age: 24}');
  })

  await t.test('Given schema:{name: string, age: number, address?: string}, obj: {name: "x", age: 24} ; should return obj', () => {
    let obj = { 
      name: 'x',
      age: 24,
    };
    let validator = vSchema({
      'name': v([defined, string]),
      'age': v([defined, number]),
      'address?': v([defined, string]),
    });
    let [error, result] = tryCatch(validator, obj);
    assert.deepStrictEqual(result, obj);
  })

  await t.test('Given schema:{name: string, age: number, address?: string}, obj: {name: "x", age: 24, address: "adsf"} ; should return obj', () => {
    let obj = { 
      name: 'x',
      age: 24,
      address: 4,
    };
    let validator = vSchema({
      'name': v([defined, string]),
      'age': v([defined, number]),
      'address?': v([defined, string]),
    });
    let [error] = tryCatch(validator, obj);
    assert.deepStrictEqual(error?.toString(), "TypeError: Expected {address} to be string. Given {address: 4}");
  })

  await t.test('Given opts={aggregateError: true} ; should return AggregateError', () => {
    let obj = { 
      name: 'x',
      age: '24',
      address: 4,
    };
    let validator = vSchema({
      'name': v([string]),
      'age': v([number]),
      'address?': v([string]),
    });
    let [error] = tryCatch(validator, obj, {aggregateError: true});
    assert.deepStrictEqual(error?.toString(), "AggregateError: vSchema Errors");
    assert.deepStrictEqual(error?.errors[0]?.toString(), "TypeError: Expected {age} to be number. Given {age: 24}");
    assert.deepStrictEqual(error?.errors[1]?.toString(), "TypeError: Expected {address} to be string. Given {address: 4}");
  })

})

test('composeValidators(validators[]:fn, opts?:object, obj:object, onError?:fn);', async(t) => {
  let compareDates = (obj) => {
    let {offerDate, joiningDate}=obj
    if(new Date(offerDate) < new Date(joiningDate)) return obj;
    throw TypeError(`Expected offerDate to be before joiningDate. Given offerDate: ${offerDate}, joiningDate: ${joiningDate}`);
  };
  let assignDefaults = (obj) => {
    return Object.assign({
      address: 'N/A'
    }, obj);
  }
  await t.test('Given {age: "24"} ; should throw Age TypeError ', () => {
    let obj = {
      name: 'x',
      age: '24',
      address: '204, kumudham nagar',
      offerDate: '04/01/2024',
      joiningDate: '03/17/2024',
    }
    let objValidator = composeValidators([
      vSchema({
        'name': v([string]),
        'age': v([number]),
        'address?': v([string]),
      }),
      compareDates,
      assignDefaults
    ]);
    let [error] = tryCatch(objValidator, obj);
    assert.deepStrictEqual(error?.toString(), 'TypeError: Expected {age} to be number. Given {age: 24}');
  })

  await t.test('Given offerDate after joiningDate ; should throw compare Error ', () => {
    let obj = {
      name: 'x',
      age: 24,
      address: '204, kumudham nagar',
      offerDate: '04/01/2024',
      joiningDate: '03/17/2024',
    }
    let objValidator = composeValidators([
      vSchema({
        'name': v([string]),
        'age': v([number]),
        'address?': v([string]),
      }),
      compareDates,
      assignDefaults
    ]);
    let [error] = tryCatch(objValidator, obj);
    assert.deepStrictEqual(error?.toString(), 'TypeError: Expected offerDate to be before joiningDate. Given offerDate: 04/01/2024, joiningDate: 03/17/2024');
  })

  await t.test('Given defaults; should apply defaults', () => {
    let obj = {
      name: 'x',
      age: 24,
      offerDate: '03/17/2024',
      joiningDate: '04/01/2024',
    }
    let objValidator = composeValidators([
      vSchema({
        'name': v([string]),
        'age': v([number]),
        'address?': v([string]),
      }),
      compareDates,
      assignDefaults
    ]);
    let actual = objValidator(obj);
    assert.deepStrictEqual(actual, {...obj, address: 'N/A'});
  })

  await t.test('Given aggregateError:true; should aggregate all errors including vschema errors', () => {
    let obj = {
      name: 'x',
      age: '24', // Error
      offerDate: '04/01/2024', // Error
      joiningDate: '03/17/2024', // Error
      address: 0, // Error
    }
    let objValidator = composeValidators([
      vSchema({
        'name': v([string]),
        'age': v([number]),
        'address?': v([string]),
      }),
      compareDates,
      assignDefaults
    ]);
    let [error] = tryCatch(objValidator, obj, {aggregateError: true});

    assert.deepStrictEqual(error.message, "composeValidator Errors");
    assert.deepStrictEqual(error.errors.length, 3);
    assert.deepStrictEqual(error.errors[0].message, "Expected {age} to be number. Given {age: 24}");
    assert.deepStrictEqual(error.errors[1].message, "Expected {address} to be string. Given {address: 0}");
    assert.deepStrictEqual(error.errors[2].message, "Expected offerDate to be before joiningDate. Given offerDate: 04/01/2024, joiningDate: 03/17/2024");
    
  })


  await t.test('Given onError on composeValidator ; should pass error to onError and return', () => {
    let obj = {
      name: 'x',
      age: '24', // Error
      offerDate: '04/01/2024', // Error
      joiningDate: '03/17/2024', // Error
      address: 0, // Error
    }
    let userSchema = composeValidators([
      vSchema({
        'name': v([string]),
        'age': v([number]),
        'address?': v([string]),
      }),
      compareDates,
      assignDefaults
    ]);
    // aggregate: false
    {
      let actual = userSchema(obj, {onError: (e) => {
        assert.deepStrictEqual(e.message, "Expected {age} to be number. Given {age: 24}");
        return false;
      }})
      assert.deepStrictEqual(actual, false);
    }
    // aggregate: true
    {
      let actual = userSchema(obj, {onError: (e) => {
        assert.deepStrictEqual(e.message, "composeValidator Errors");
        assert.deepStrictEqual(e.errors.length, 3);
        return false;

      }, aggregateError: true})
      assert.deepStrictEqual(actual, false);
    }
  });



})
// Not implementing
// test.todo('write test for vKeys?');
test.todo('write test predicates - composability');




