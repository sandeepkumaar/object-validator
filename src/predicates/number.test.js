import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";

import { number, minNumber, maxNumber } from "./number.js";

test("number", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(number, "x");
    let [error2] = tryCatch(number, "x", "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {input} to be number. Given {input: x}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be number. Given {custom: x}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(number(100), 100);
  });
});

test("minNumber", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(minNumber("18"), 12);
    let [error2] = tryCatch(minNumber(18), "12");
    let [error3] = tryCatch(minNumber(18), 12, "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {minNumber} to be number. Given {minNumber: 18}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {input} to be number. Given {input: 12}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {custom} to be greater than or equal to 18. Given {custom: 12}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(minNumber(100)(120), 120);
  });
});

test("maxNumber", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(maxNumber("12"), 18);
    let [error2] = tryCatch(maxNumber(12), 18, "custom");
    let [error3] = tryCatch(maxNumber(12), 18, "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {maxNumber} to be number. Given {maxNumber: 12}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be less than or equal to 12. Given {custom: 18}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {custom} to be less than or equal to 12. Given {custom: 18}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(maxNumber(120)(100), 100);
  });
});
