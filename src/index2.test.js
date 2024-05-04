import { test } from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import {
  string,
  defined,
  number,
  setDefault,
  date,
} from "./predicates/index.js";
import { validate, schemaValidator, validator } from "./index2.js";

/** @typedef {import('./index.js').CustomError} CustomError*/

test("validate(predicates[]: fn, value: any, key?: string) => any", async (t) => {
  await t.test(
    //'Given predicates: [defined, string], value: "x" ; should return "x"',
    "Given predicates and valid value, should return the given value",
    () => {
      assert.deepStrictEqual(validate([defined, string], "x"), "x");
    },
  );

  await t.test(
    //"Given predicates: [defined, string], value: undefined ; should throw undefined TypeError",
    "Given predicates and invalid value, should throw invalid value error",
    () => {
      let [error] = tryCatch(validate, [defined, string], undefined);
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {input} to be defined. Given {input: undefined}",
      );
    },
  );

  await t.test(
    //'Given predicates: [defined, string], value: "x", key: undefined ; should throw TypeError with default key',
    "Given predicates and invalid value without key, should throw invalid error with default key",
    () => {
      let [error] = tryCatch(validate, [defined, string], 1);
      assert.deepStrictEqual(
        error.message,
        "Expected {input} to be string. Given {input: 1}",
      );
      assert.deepStrictEqual(error.key, undefined);
    },
  );
  await t.test(
    //'Given predicates: [defined, string], value: "x", key: "customKey" ; should throw TypeError with addnProps',
    "Given predicates and invalid value with customKey, should throw invalid error with custom key",
    () => {
      let [error] = tryCatch(validate, [defined, string], 1, "customKey");
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {customKey} to be string. Given {customKey: 1}",
      );
      assert.deepStrictEqual(error.key, "customKey");
      assert.deepStrictEqual(error.value, 1);
      assert.deepStrictEqual(error.predicate, "string");
    },
  );

  await t.test(
    //"Given predicates: [defined, string], decorateError: fn, value: undefined ; should throw custom Error",
    "Given predicates and invalid value with Optional errorDecorator, should throw invalid error returned from decoratorFn",
    () => {
      let [error] = tryCatch(
        validate,
        [
          defined,
          string,
          {
            errCb: (e) => {
              e.message = "customError message";
              e.key = "customErrorKey";
              return e;
            },
          },
        ],
        undefined,
      );
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: customError message",
      );
      assert.deepStrictEqual(error?.key, "customErrorKey");
    },
  );
  await t.test(
    "Given predicates, should carry forward the values returned from each predicates",
    () => {
      let concat =
        (str = "") =>
        (value = "") =>
          value + str;

      let value = validate([string, concat("y"), string], "x");
      assert.deepStrictEqual(value, "xy");
    },
  );
});

test("schemaValidator(obj: object, schema: object, opts: object) => object", async (t) => {
  await t.test(
    //'Given schema:{name: string, age: number}, obj: {name: "x", age: 24} ; should return obj',
    "Given schema and valid object, should return the given object",
    () => {
      let obj = {
        name: "x",
        age: 24,
      };
      let actual = schemaValidator(obj, {
        name: [defined, string],
        age: [defined, number],
      });
      assert.deepStrictEqual(actual, obj);
    },
  );

  await t.test(
    //'Given schema:{name: string, age: number}, obj: {name: "x", age: "24"} ; should throw Age Error',
    "Given schema and invalid obj, should throw invalid value error with the property key",
    () => {
      let obj = {
        name: "x",
        age: "24",
      };
      let schema = {
        name: [defined, string],
        age: [defined, number],
      };
      let [error] = tryCatch(schemaValidator, obj, schema);
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {age} to be number. Given {age: 24}",
      );
    },
  );

  await t.test(
    //'Given schema:{name: string, age: number, address?: string}, obj: {name: "x", age: 24} ; should return obj',
    "Given schema with optional key and a valid obj without that optional key, should ignore the optional key",
    () => {
      let obj = {
        name: "x",
        age: 24,
      };
      let schema = {
        name: [defined, string],
        age: [defined, number],
        "address?": [defined, string],
      };
      let [, result] = tryCatch(schemaValidator, obj, schema);
      assert.deepStrictEqual(result, obj);
    },
  );

  await t.test(
    //'Given schema:{name: string, age: number, address?: string}, obj: {name: "x", age: 24, address: "adsf"} ; should return obj',
    "Given schema with optional key and object with invalid optional value, should throw invalid error",
    () => {
      let obj = {
        name: "x",
        age: 24,
        address: 4,
      };
      let schema = {
        name: [defined, string],
        age: [defined, number],
        "address?": [defined, string],
      };
      let [error] = tryCatch(schemaValidator, obj, schema);
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {address} to be string. Given {address: 4}",
      );
    },
  );

  await t.test(
    //"Given opts={aggregateError: true} ; should return AggregateError",
    "Given schema with optional aggragateError, should throw AggregateError aggregating all errors in the object",
    () => {
      let obj = {
        name: "x",
        age: "24",
        address: 4,
      };
      let schema = {
        name: [string],
        age: [number],
        "address?": [string],
      };
      let [error] = tryCatch(schemaValidator, obj, schema, {
        aggregateError: true,
      });
      assert.deepStrictEqual(
        error?.toString(),
        "AggregateError: schemaValidator Errors",
      );
      assert.deepStrictEqual(
        error?.errors[0]?.toString(),
        "TypeError: Expected {age} to be number. Given {age: 24}",
      );
      assert.deepStrictEqual(
        error?.errors[1]?.toString(),
        "TypeError: Expected {address} to be string. Given {address: 4}",
      );
    },
  );

  await t.test(
    "Given schema with normal predicates, should have same validation behavior",
    () => {
      let obj = {
        name: "x",
        age: "24",
        address: 4,
      };
      let schema = {
        name: string,
        age: number,
        "address?": string,
      };
      let [error] = tryCatch(schemaValidator, obj, schema);
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {age} to be number. Given {age: 24}",
      );
      let [aggregateError] = tryCatch(schemaValidator, obj, schema, {
        aggregateError: true,
      });
      assert.deepStrictEqual(
        aggregateError?.toString(),
        "AggregateError: schemaValidator Errors",
      );
      assert.deepStrictEqual(
        aggregateError?.errors[0]?.toString(),
        "TypeError: Expected {age} to be number. Given {age: 24}",
      );
      assert.deepStrictEqual(
        aggregateError?.errors[1]?.toString(),
        "TypeError: Expected {address} to be string. Given {address: 4}",
      );
    },
  );

  await t.test(
    "Given schema with predicates modifying the values, should modify value in the obj",
    () => {
      let obj = { name: "sandeep" };
      let schema1 = {
        name: string,
        age: [setDefault(24), number],
      };
      assert.deepStrictEqual(schemaValidator(obj, schema1), {
        name: "sandeep",
        age: 24,
      });
      assert.deepStrictEqual(
        schemaValidator(
          {
            name: "sandeep",
            age: 30,
          },
          schema1,
        ),
        {
          name: "sandeep",
          age: 30,
        },
      );
    },
  );
});

test("validators(obj:object, schema: object, opts?:object);", async (t) => {
  let compareDates = (obj) => {
    let { offerDate, joiningDate } = obj;
    if (new Date(offerDate) < new Date(joiningDate)) return obj;
    throw TypeError(
      `Expected offerDate to be before joiningDate. Given offerDate: ${offerDate}, joiningDate: ${joiningDate}`,
    );
  };
  let assignDefaults = (obj) => {
    return Object.assign(
      {
        address: "N/A",
      },
      obj,
    );
  };
  await t.test(
    "Given validators and invalid object, should throw Invalid error",
    () => {
      let obj = {
        name: "x",
        age: "24",
        address: "204, kumudham nagar",
        offerDate: "04/01/2024",
        joiningDate: "03/17/2024",
      };
      let schema = {
        name: [string],
        age: [number],
        "address?": [string],
      };
      let opts = {
        pipeline: [compareDates, assignDefaults],
      };
      let [error] = tryCatch(validator, obj, schema, opts);
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {age} to be number. Given {age: 24}",
      );
    },
  );

  await t.test(
    //"Given offerDate after joiningDate ; should throw compare Error ",
    "Given predicate after schema, should be called with obj",
    () => {
      let obj = {
        name: "x",
        age: 24,
        address: "204, kumudham nagar",
        offerDate: "04/01/2024",
        joiningDate: "03/17/2024",
      };
      let schema = {
        name: [string],
        age: [number],
        "address?": [string],
        "offerDate?": [date],
        "joiningDate?": [date],
      };
      let opts = {
        pipeline: [compareDates, assignDefaults],
      };
      let [error] = tryCatch(validator, obj, schema, opts);
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected offerDate to be before joiningDate. Given offerDate: 04/01/2024, joiningDate: 03/17/2024",
      );
    },
  );

  await t.test("Given function defaults, should apply defaults", () => {
    let obj = {
      name: "x",
      age: 24,
      offerDate: "03/17/2024",
      joiningDate: "04/01/2024",
    };
    let schema = {
      name: [string],
      age: [number],
      "address?": [string],
      "offerDate?": [date],
      "joiningDate?": [date],
    };
    let opts = {
      pipeline: [compareDates, assignDefaults],
    };
    let actual = validator(obj, schema, opts);
    assert.deepStrictEqual(actual, { ...obj, address: "N/A" });
  });

  await t.test(
    "Given aggregateError:true, should only aggregate schema errors",
    () => {
      let obj = {
        name: "x",
        age: "24", // Error
        offerDate: "04/01/2024", // Error from pipeline
        joiningDate: "03/17/2024", // Error from pipeline
        address: 0, // Error
      };
      let schema = {
        name: [string],
        age: [number],
        "address?": [string],
        "offerDate?": [date],
        "joiningDate?": [date],
      };
      let pipeline = [compareDates, assignDefaults];
      let [error] = tryCatch(validator, obj, schema, {
        aggregateError: true,
        pipeline,
      });

      assert.deepStrictEqual(error.message, "schemaValidator Errors");
      assert.deepStrictEqual(error.errors.length, 2);
      assert.deepStrictEqual(
        error.errors[0].message,
        "Expected {age} to be number. Given {age: 24}",
      );
      assert.deepStrictEqual(
        error.errors[1].message,
        "Expected {address} to be string. Given {address: 0}",
      );
    },
  );

  await t.test(
    "Given onError on composeValidator, should pass error to onError and return",
    () => {
      let obj = {
        name: "x",
        age: "24", // Error
        offerDate: "04/01/2024", // Error
        joiningDate: "03/17/2024", // Error
        address: 0, // Error
      };
      let schema = {
        name: [string],
        age: [number],
        "address?": [string],
      };
      // aggregate: false
      {
        let actual = validator(obj, schema, {
          handleError: (e) => {
            assert.deepStrictEqual(
              e.message,
              "Expected {age} to be number. Given {age: 24}",
            );
            return false;
          },
          pipeline: [compareDates, assignDefaults],
        });
        assert.deepStrictEqual(actual, false);
      }
      // aggregate: true
      {
        let actual = validator(obj, schema, {
          handleError: (e) => {
            assert.deepStrictEqual(e.message, "schemaValidator Errors");
            assert.deepStrictEqual(e.errors.length, 3);
            return false;
          },
          aggregateError: true,
        });
        assert.deepStrictEqual(actual, false);
      }
    },
  );
});

// Not implementing
// test.todo('write test for vKeys?');
test.todo("write test predicates - composability");
