// can remove this in favour fo success cases
let assertComposability = (fn, arg, assert) => {
  assert({
    given: "a pair obj",
    should: "return the same pair obj",
    actual: fn(arg),
    expected: arg,
  });
};

module.exports = {
  assertComposability,
};
