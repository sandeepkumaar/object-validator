// @ts-ignore
import tinySchema from "tiny-schema";

/** @param {any} value*/
const getError = (key = "", value, condition = "") => {
  let e = TypeError(
    `Expected {${key}} to satisfy {${condition}} validation. Given {${key}: ${value}}`,
  );
  // @ts-ignore
  e.predicate = condition;
  return e;
};

export function is(scheme = "") {
  /** @param {any} value*/
  return function (value, key = "input") {
    if (tinySchema(scheme)(value)) return value;
    throw getError(key, value, scheme);
  };
}
