const { describe, Try } = require("riteway");
const { date, minDate, maxDate, dateEquals } = require("./date");
const { assertComposability } = require("./utils");

/*
var x = Try(date, {key: "age", value: "xx"});
console.log(x.toString());
*/

describe("date", async function(assert) {
  // test for pure, identity function & pass valid date arg
  //assertComposability(date, { key: "age", value: "09/14/1992" }, assert);

  { // type check
    let pair = { key: "age", value: "abc" };
    assert({
      given: "pair value=abc", 
      should: "throw err expecting Date",
      actual: Try(date, pair).toString(),
      expected: "TypeError: Expected {age} to be of type Date. Given {age: abc}"
    })
  }
});
