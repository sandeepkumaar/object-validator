// @ts-ignore
import tinySchema from "tiny-schema";

const getError = (key, value, condition) => {
  let e = TypeError(
    `Expected {${key}} to satisfy {${condition}} validation. Given {${key}: ${value}}`,
  );
  e.predicate = condition;
  return e;
};

export function is(scheme) {
  return function (value, key = "input") {
    if (tinySchema(scheme)(value)) return value;
    throw getError(key, value, scheme);
  };
}
