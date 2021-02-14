const { describe, Try } = require("riteway");
const { truthy, falsy } = require("./boolean");
const { assertComposability } = require("./utils");


describe("truthy", async function(assert) {
  // test for pure, identity function & check truthy pass
  assertComposability(truthy, { key: "age", value: 100 }, assert);

  { // check truthy : fail
    let pair = { key: "name", value: null };
    assert({
      given: "pair value=null",
      should: "throw err expecting truthy value",
      actual: Try(truthy, pair).toString(),
      expected: "TypeError: Expected {name} to be truthy. Given {name: null}"
    })
  }

});


describe("falsy", async function(assert) {
  // test for pure, identity function
  assertComposability(falsy, { key: "name", value: "" }, assert);
  {
    let pair = { key: "name", value: "abc" };
    assert({
      given: "pair value=abc",
      should: "throw err expecting falsy value",
      actual: Try(falsy, pair).toString(),
      expected: "TypeError: Expected {name} to be falsy. Given {name: abc}"
    })
  }

});
