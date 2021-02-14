const { describe, Try } = require("riteway");
const { regex } = require("./regex");
const { assertComposability } = require("./utils");

//let checkRegex = regex('/sand*')

describe("regex(/sand*/): literal version", async function(assert) {

  assertComposability(regex(), { key: "name", value: "sand*" }, assert);

  let checkRegex = regex(/sand*/)
  // check regex: pass
  {
    let pair = {key: "name", value: "sandeep"};
    assert({
      given: "pair value=sandeep for regex(/sand*/)",
      should: "return pair",
      actual: checkRegex(pair),
      expected: pair

    })
  }
  { // check regex: fail
    let pair = {key: "name", value: "abc"};
    assert({
      given: "pair value=abc for regex(/sand*/)",
      should: "Throw TypeErr expecting to match",
      actual: Try(checkRegex, pair).toString(),
      expected: "TypeError: Expected {name} to be of pattern /sand*/. Given {name: abc}"
    })
  }
});



