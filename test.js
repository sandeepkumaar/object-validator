import { test } from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { is, defined, setDefault, date, pick } from "./src/predicates/index.js";

import validator from "./src/index.js";

test("Invalid arguments checks", async (t) => {
  let obj = {
    name: "sandeep",
    age: 30,
  };
  let [error1] = tryCatch(validator, obj, {
    name: [],
  });
  let [error2] = tryCatch(validator, obj, {
    name: "abc",
  });
  let [error3] = tryCatch(validator, obj, {
    name: [{}],
  });
  let [error4] = tryCatch(validator, obj);
  let [error5] = tryCatch(validator, [], {
    name: "string",
  });
  assert.deepStrictEqual(
    error1?.toString(),
    'TypeError: "name" should have either tiny-schema string or a function or an array with minimum one predicate',
  );
  assert.deepStrictEqual(
    error2?.toString(),
    "SyntaxError: Malformed schema string",
  );
  assert.deepStrictEqual(
    error3?.toString(),
    'TypeError: No predicates found for "name"',
  );
  assert.deepStrictEqual(
    error4?.toString(),
    "TypeError: Expected schema to be an object. Given undefined",
  );
  assert.deepStrictEqual(
    error5?.toString(),
    "TypeError: Expected input to be an object. Given ",
  );
});

test("Schema pipelines: tiny-schema string, predicate function, predicateArray", async (t) => {
  let obj = {
    name: "sandeep",
    age: 30,
  };
  await t.test("tiny-schema strings", () => {
    let schema = {
      name: ["string"],
      age: ["number", "18-24"],
    };
    let [error] = tryCatch(validator, obj, schema);
    assert.deepStrictEqual(
      error?.toString(),
      "TypeError: Expected {age} to satisfy {18-24} validation. Given {age: 30}",
    );
  });
  await t.test("single function, single schema string", () => {
    let schema1 = {
      name: function pred() {
        throw TypeError("always throw");
      },
      age: ["number", "18-24"],
    };
    let schema2 = {
      name: "string",
      age: "18-24",
    };
    let [error1] = tryCatch(validator, obj, schema1);
    assert.deepStrictEqual(error1?.toString(), "TypeError: always throw");
    assert.deepStrictEqual(error1?.key, "name");
    assert.deepStrictEqual(error1?.value, "sandeep");
    assert.deepStrictEqual(error1?.predicate, "pred");
    let [error2] = tryCatch(validator, obj, schema2);
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {age} to satisfy {18-24} validation. Given {age: 30}",
    );
    assert.deepStrictEqual(error2?.key, "age");
    assert.deepStrictEqual(error2?.value, 30);
    assert.deepStrictEqual(error2?.predicate, "18-24");
  });
  await t.test("predicates array with different combo", () => {
    let schema1 = {
      name: [
        "string",
        () => {
          throw TypeError("always throw");
        },
      ],
      age: [is("string"), "18-24"],
    };
    let schema2 = {
      name: "string",
      age: [is("string"), "18-24"],
    };
    let [error1] = tryCatch(validator, obj, schema1);
    assert.deepStrictEqual(error1?.toString(), "TypeError: always throw");
    let [error2] = tryCatch(validator, obj, schema2);
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {age} to satisfy {string} validation. Given {age: 30}",
    );
  });

  await t.test("predicates can modify values", () => {
    let schema1 = {
      name: ["string", (v) => v + "kumaar"],
      age: "number",
    };
    let [, value] = tryCatch(validator, obj, schema1);
    assert.deepStrictEqual(value, {
      name: "sandeepkumaar",
      age: 30,
    });
  });
});

test("Schema opts: {errCb, optKey}", async (t) => {
  //t.runOnly(true);
  let obj = {
    name: "sandeep",
    age: 30,
  };
  await t.test("errCb", () => {
    let schema = {
      name: ["string"],
      age: [
        is("number"),
        "18-24",
        {
          errCb: (e) => {
            e.message = "age is wrong";
            return e;
          },
        },
      ],
    };
    let [error] = tryCatch(validator, obj, schema);
    assert.deepStrictEqual(error?.toString(), "TypeError: age is wrong");
  });

  await t.test("optKey", () => {
    let schema1 = {
      name: ["string"],
      age: ["number"],
      city: ["string"],
    };
    let schema2 = {
      name: ["string"],
      age: ["number"],
      "city?": ["string"],
    };
    let schema3 = {
      name: ["string"],
      age: ["number"],
      city: ["string", { optKey: true }],
    };
    let [error1] = tryCatch(validator, obj, schema1);
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {city} to satisfy {string} validation. Given {city: undefined}",
    );
    let [, value1] = tryCatch(validator, obj, schema2);
    assert.deepStrictEqual(value1, obj);
    let [, value2] = tryCatch(validator, obj, schema3);
    assert.deepStrictEqual(value2, obj);
  });
});

// aggregateError, handleError, pipeline
test("Validator Options: { strict=true, aggregateError=false, handleError: fn, pipeline: []}", async (t) => {
  let obj = {
    name: "sandeep",
    age: 30,
  };
  await t.test("strict", () => {
    let newObj = { ...obj, x: "y" };
    let schema = {
      name: ["string"],
      age: ["number"],
    };
    let [error1] = tryCatch(validator, newObj, schema);
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Unrecognized keys [x]",
    );
    let [, value] = tryCatch(validator, newObj, schema, { strict: false });
    assert.deepStrictEqual(value, newObj);
  });

  await t.test("aggregaeError", () => {
    let schema = {
      name: ["number", "18-20"],
      age: ["string"],
    };
    let [error] = tryCatch(validator, obj, schema, { aggregateError: true });
    assert.deepStrictEqual(
      error?.toString(),
      "AggregateError: schemaValidator Errors",
    );
    assert.deepStrictEqual(error?.errors.length, 2);
    assert.deepStrictEqual(
      error?.errors[0].toString(),
      "TypeError: Expected {name} to satisfy {number} validation. Given {name: sandeep}",
    );
    assert.deepStrictEqual(
      error?.errors[1].toString(),
      "TypeError: Expected {age} to satisfy {string} validation. Given {age: 30}",
    );
  });
  await t.test("handleError", () => {
    let schema = {
      name: ["number", "18-20"],
      age: ["string"],
    };
    let [, value] = tryCatch(validator, obj, schema, {
      aggregateError: true,
      handleError: (error) => {
        assert.deepStrictEqual(
          error?.toString(),
          "AggregateError: schemaValidator Errors",
        );
        assert.deepStrictEqual(error?.errors.length, 2);
        assert.deepStrictEqual(
          error?.errors[0].toString(),
          "TypeError: Expected {name} to satisfy {number} validation. Given {name: sandeep}",
        );
        assert.deepStrictEqual(
          error?.errors[1].toString(),
          "TypeError: Expected {age} to satisfy {string} validation. Given {age: 30}",
        );
        return false;
      },
    });
    assert.deepStrictEqual(value, false);
  });

  await t.test("pipeline", () => {
    let obj = {
      name: "sandeep",
      age: 30,
    };
    let modifiedObj = { ...obj, x: "unknown" };
    let schema = {
      name: ["string"],
      age: ["number"],
    };
    let [, value] = tryCatch(validator, modifiedObj, schema, {
      strict: false,
      pipeline: [pick(["name", "age"])],
    });
    assert.deepStrictEqual(value, obj);
  });
});
