const { describe, Try } = require("riteway");
const { number, minNumber, maxNumber } = require("./number");
const { assertComposability } = require("./utils");

describe("number", async function(assert) {
  // test for pure, identity function
  assertComposability(number, { key: "age", value: 100 }, assert);

  { // type check
    let pair = { key: "age", value: "abc" };
    assert({
      given: "pair value=abc", 
      should: "throw err expecting number",
      actual: Try(number, pair).toString(),
      expected: "TypeError: Expected {age} to be of type number. Given {age: abc}"
    })
  }
});


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
