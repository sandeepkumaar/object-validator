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
      "TypeError: Expected {input} to be a number. Given {input: x}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be a number. Given {custom: x}",
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
      "TypeError: Expected {minNumber} to be a number. Given {minNumber: 18}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {input} to be a number. Given {input: 12}",
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
      "TypeError: Expected {maxNumber} to be a number. Given {maxNumber: 12}",
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

/*
describe("minNumber", async function(assert) {
  // test for pure, identity function
  assertComposability(minNumber(18), {key: "age", value: 24 }, assert);

  { // type check
    let pair = { key: "age", value: false };
    assert({
      given: "pair value=boolean", 
      should: "throw type err expecting number",
      actual: Try(number, pair).toString(),
      expected: "TypeError: Expected {age} to be of type number. Given {age: false}"
    })
  }

  { // min number check: fail
    let pair = {key: "age", value: 24}
    assert({
      given: "pair value=24 for minNumber(28)",
      should: "throw err expecting minValue=28",
      actual: Try(minNumber(28), pair).toString(),
      expected: 'TypeError: Expected {age} to be greater than or equal to 28. Given {age: 24}'
    })
  }

  { // min number check: pass
    let pair = {key: "age", value: 24}
    assert({
      given: "pair value=24 for minNumber(24)",
      should: "return pair",
      actual: minNumber(24)(pair),
      expected: pair
    })
  }

});


describe("maxNumber", async function(assert) {
  // test for pure, identity function
  assertComposability(maxNumber(30), {key: "age", value: 24 }, assert);

  { // type check
    let pair = { key: "age", value: "x" };
    assert({
      given: "pair value=string", 
      should: "throw type err expecting number",
      actual: Try(number, pair).toString(),
      expected: "TypeError: Expected {age} to be of type number. Given {age: x}"
    })
  }

  { // max number check: fail
    let pair = {key: "age", value: 34}
    assert({
      given: "pair value=34 for maxNumber(28)",
      should: "throw err expecting maxValue=28",
      actual: Try(maxNumber(28), pair).toString(),
      expected: 'TypeError: Expected {age} to be less than or equal to 28. Given {age: 34}'
    })
  }

  { // max number check: pass
    let pair = {key: "age", value: 18}
    assert({
      given: "pair value=18 for maxNumber(24)",
      should: "return pair",
      actual: maxNumber(24)(pair),
      expected: pair
    })
  }

});
*/
