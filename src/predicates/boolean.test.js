import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { truthy, falsy, boolean } from "./boolean.js";

test("truthy", async (t) => {
  await t.test(
    "Given falsy value without key, should throw error with default key",
    () => {
      let [error1] = tryCatch(truthy, "");
      let [error2] = tryCatch(truthy, null);
      let [error3] = tryCatch(truthy, false);
      assert.deepStrictEqual(
        error1?.toString(),
        "TypeError: Expected {input} to be truthy. Given {input: }",
      );
      assert.deepStrictEqual(
        error2?.toString(),
        "TypeError: Expected {input} to be truthy. Given {input: null}",
      );
      assert.deepStrictEqual(
        error3?.toString(),
        "TypeError: Expected {input} to be truthy. Given {input: false}",
      );
    },
  );

  await t.test(
    "Given falsy value with key, should throw error with default key",
    () => {
      let [error] = tryCatch(truthy, "", "x");
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {x} to be truthy. Given {x: }",
      );
    },
  );

  await t.test("Given truthy, should return the same value", () => {
    let [, v1] = tryCatch(truthy, "hi", "x");
    let [, v2] = tryCatch(truthy, true, "x");
    assert.deepStrictEqual(v1, "hi");
    assert.deepStrictEqual(v2, true);
  });
});

test("falsy", async (t) => {
  await t.test(
    "Given truthy value without key, should throw error with default key",
    () => {
      let [error1] = tryCatch(falsy, "hi");
      let [error2] = tryCatch(falsy, true);
      assert.deepStrictEqual(
        error1?.toString(),
        "TypeError: Expected {input} to be falsy. Given {input: hi}",
      );
      assert.deepStrictEqual(
        error2?.toString(),
        "TypeError: Expected {input} to be falsy. Given {input: true}",
      );
    },
  );

  await t.test(
    "Given falsy value with key, should throw error with default key",
    () => {
      let [error] = tryCatch(falsy, "hi", "x");
      assert.deepStrictEqual(
        error?.toString(),
        "TypeError: Expected {x} to be falsy. Given {x: hi}",
      );
    },
  );

  await t.test("Given falsy, should return the same value", () => {
    let [, v1] = tryCatch(falsy, "", "x");
    let [, v2] = tryCatch(falsy, false, "x");
    assert.deepStrictEqual(v1, "");
    assert.deepStrictEqual(v2, false);
  });
});

test("boolean", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(boolean, "");
    let [error2] = tryCatch(boolean, "", "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {input} to be a boolean. Given {input: }",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be a boolean. Given {custom: }",
    );
  });
  await t.test("pass", () => {
    let [, v1] = tryCatch(boolean, false);
    let [, v2] = tryCatch(boolean, true);
    assert.deepStrictEqual(v1, false);
    assert.deepStrictEqual(v2, true);
  });
});
