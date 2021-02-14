const { describe, Try } = require("riteway");
const { string, minString, maxString } = require("./string");


let assertComposability = (fn, arg, assert) => {
  assert({
    given: "a pair obj",
    should: "return the same pair obj",
    actual: fn(arg),
    expected: arg
  })
};

describe("string", async function(assert) {
  // test for pure, identity function
  assertComposability(string, { key: "name", value: "sandeep" }, assert);

  { // type check
    let pair = { key: "name", value: 4 };
    assert({
      given: "pair value=4", 
      should: "throw err expecting string",
      actual: Try(string, pair).toString(),
      expected: "TypeError: Expected {name} to be of type string. Given {name: 4}"
    })
  }

});

describe("minString", async function(assert) {
  // test for pure, identity function
  assertComposability(minString(7), {key: "name", value: "sandeep"}, assert);

  { // type check
    let pair = { key: "name", value: false };
    assert({
      given: "pair value=boolean", 
      should: "throw type err expecting string",
      actual: Try(string, pair).toString(),
      expected: "TypeError: Expected {name} to be of type string. Given {name: false}"
    })
  }

  { // min string length check: fail
    let pair = {key: "name", value: "abcd"}
    assert({
      given: "pair value='abcd' for minString(6)",
      should: "throw err expecting len=6",
      actual: Try(minString(6), pair).toString(),
      expected: 'TypeError: Expected {name} to be of minimum length 6. Given {name: abcd}'
    })
  }

  { // min string length check: pass
    let pair = {key: "name", value: "abcd"}
    assert({
      given: "pair value=4 for minString(4)",
      should: "return pair",
      actual: minString(4)(pair),
      expected: pair
    })
  }

});



describe("maxString", async function(assert) {
  // test for pure, identity function
  assertComposability(maxString(10), {key: "name", value: "sandeep"}, assert);

  { // type check
    let pair = { key: "name", value: {} };
    assert({
      given: "pair value={} for maxString()()", 
      should: "throw type err expecting string",
      actual: Try(string, pair).toString(),
      //expected: "TypeError: Expected {name} to be of type string. Given {name: {}}"
      expected: "TypeError: Expected {name} to be of type string. Given {name: [object Object]}"
    })
  }

  { // max string length check: fail
    let pair = {key: "name", value: "abcdefg"}
    assert({
      given: "pair value='abcdefg' for maxString(6)",
      should: "throw err expecting maxlen=6",
      actual: Try(maxString(6), pair).toString(),
      expected: 'TypeError: Expected {name} to be of maximum length 6. Given {name: abcdefg}'
    })
  }

  { // max string length check: pass
    let pair = {key: "name", value: "abcd"}
    assert({
      given: "pair value='abcd' for maxString(4)",
      should: "return pair",
      actual: maxString(4)(pair),
      expected: pair
    })
  }

});
