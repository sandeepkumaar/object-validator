const { describe, Try } = require("riteway");
const { equals, deepEquals } = require("./equals");
const { assertComposability } = require("./utils");


describe("equals", async function(assert) {
  let checkEquals = equals("sandeep");
  // test for pure, identity function
  assertComposability(checkEquals, { key: "name", value: "sandeep" }, assert);

  { // check equals
    let pair = { key: "name", value: "sandeep" };
    assert({
      given: "pair value=sandeep for eqauls('sandeep')",
      should: "return pair",
      actual: checkEquals(pair),
      expected: pair
    })
  }

  { // check equals: fail
    let pair = { key: "name", value: 5 };
    assert({
      given: "pair value=r for eqauls('sandeep')",
      should: "throw TypeErr expecting to be equal",
      actual: Try(checkEquals, pair).toString(),
      expected: "TypeError: Expected {name} to be equal to sandeep. Given {name: 5}"
    })
  }
})

