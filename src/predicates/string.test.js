import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";

import { string, minString, maxString } from "./string.js";

test("string", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(string, 0);
    let [error2] = tryCatch(string, false, "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {input} to be string. Given {input: 0}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be string. Given {custom: false}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(string("100"), "100");
  });
});

test("minString", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(minString("0"), 0);
    let [error2] = tryCatch(minString(4), false, "custom");
    let [error3] = tryCatch(minString(4), "fal", "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {minString} to be number. Given {minString: 0}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be string. Given {custom: false}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {custom} to be of minimum length 4. Given {custom: fal}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(minString(4)("false"), "false");
  });
});

test("maxString", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(maxString("0"), 0);
    let [error2] = tryCatch(maxString(4), false, "custom");
    let [error3] = tryCatch(maxString(4), "false", "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {maxString} to be number. Given {maxString: 0}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be string. Given {custom: false}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {custom} to be of maximum length 4. Given {custom: false}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(maxString(4)("fal"), "fal");
  });
});
