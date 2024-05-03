import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { equals } from "./equals.js";

test("equals", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(equals("sdf"), "asdf");
    let [error2] = tryCatch(equals({}), {}, "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {input} to be equal to sdf. Given {input: asdf}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be equal to [object Object]. Given {custom: [object Object]}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(equals("04/01/2024")("04/01/2024"), "04/01/2024");
  });
});
